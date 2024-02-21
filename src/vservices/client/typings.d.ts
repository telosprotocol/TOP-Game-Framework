declare namespace API {
  type ActivitiesManagementVO = {
    /**   Id */
    id?: string;
    /**      */
    createdDate?: number;
    /**      */
    modifiedDate?: number;
    /**        Id */
    nameId?: string;
    /**      */
    name?: string;
    /**      Enum (First Recharge:FIRST_CHARGE,Check in:SIGN_IN,Lucky Wheel:TURNTABLE,Higgs:HIGGS,7 Days Event:SEVEN_DAY_ACTIVITIES,Ranking:RANKING_LIST,PAY:PAY,TASK:GAME_HALL_TASK,BankruptCY:BANKRUPTCY_ACTIVITY,special recharge:SPECIAL_RECHARGE,Tomorrow gift:TOMORROW_GIFT,fission task:FISSION_TASK,novice 5 days tasks:NOVICE_FIVE_DAYS,week recharge:WEEK_RECHARGE,growth plan:GROWTH_PLAN,recovery recharge gift:RECOVERY_RECHARGE,welfare entry:WELFARE_ENTRY,Game Invite:GAME_INVITE,topup entry:TOPUP_ENTRY,recovery smash egg:RECOVERY_SMASH_EGG,pay activities entry:PAY_ENTRY,benefit:BENEFIT) */
    type?:
      | 'FIRST_CHARGE'
      | 'SIGN_IN'
      | 'TURNTABLE'
      | 'HIGGS'
      | 'SEVEN_DAY_ACTIVITIES'
      | 'RANKING_LIST'
      | 'PAY'
      | 'GAME_HALL_TASK'
      | 'BANKRUPTCY_ACTIVITY'
      | 'SPECIAL_RECHARGE'
      | 'TOMORROW_GIFT'
      | 'FISSION_TASK'
      | 'NOVICE_FIVE_DAYS'
      | 'WEEK_RECHARGE'
      | 'GROWTH_PLAN'
      | 'RECOVERY_RECHARGE'
      | 'WELFARE_ENTRY'
      | 'GAME_INVITE'
      | 'TOPUP_ENTRY'
      | 'RECOVERY_SMASH_EGG'
      | 'PAY_ENTRY'
      | 'BENEFIT';
    /**      */
    startTime?: number;
    /**      */
    endTime?: number;
    /**          */
    validStartTime?: number;
    /**          */
    validEndTime?: number;
    /**      */
    state?: boolean;
    /**      */
    sort?: number;
    /**        */
    showInList?: boolean;
    /**       */
    showAfterComplete?: boolean;
    /**        Id */
    descriptionId?: string;
    /**      */
    description?: string;
    /**     Id */
    iconId?: string;
    /**      PropertyConverter(UploadKeyConverterEditor) */
    icon?: string;
    /**     Id */
    imageId?: string;
    /**      PropertyConverter(UploadKeyConverterEditor) */
    image?: string;
    /** support hot dot true-suport */
    supportHotdot?: boolean;
    /** Display after receiving rewards */
    displayHotDotAfterRewards?: boolean;
    /**      (    ) */
    hasRedDot?: boolean;
    /** Controlling certain activities must meet prerequisite conditions before displaying them */
    displayDefault?: boolean;
  };

  type activityDetailActivityLogControllerParams = {
    /** activity ID,Long   (0~9223372036854775807) */
    id?: string;
  };

  type ActivityDetailsVO = {
    /**   ID */
    id?: string;
    /**      */
    reward?: BigDecimalString;
    /**      PropertyConverter(ProductPicConverterEditor) */
    picList?: ActivityPicVO[];
  };

  type activityFristChargetProductControllerParams = {
    /** activity ID,Long   (0~9223372036854775807) */
    id?: string;
    /** product price,Long   (0~9223372036854775807) */
    price?: string;
  };

  type ActivityPicVO = {
    /**      Enum (  banner :LANDSCAPE_BANNER,  banner :PORTRAIT_BANNER,    :HOME_ACTIVITY,    :LANDSCAPE_ACTIVITY,     :GAME_ACTIVITY,   :ICON,     :HOME_ACTIVITY_NEW) */
    name?:
      | 'LANDSCAPE_BANNER'
      | 'PORTRAIT_BANNER'
      | 'HOME_ACTIVITY'
      | 'LANDSCAPE_ACTIVITY'
      | 'GAME_ACTIVITY'
      | 'ICON'
      | 'HOME_ACTIVITY_NEW';
    /**   url */
    url?: string;
    /** product price */
    price?: BigDecimalString;
    /** gold num */
    num?: BigDecimalString;
    /** given gold num */
    givenValue?: BigDecimalString;
    /** given percent */
    percent?: BigDecimalString;
  };

  type activityProductProductControllerParams = {
    /** activity ID,Long   (0~9223372036854775807) */
    id?: string;
  };

  type AlarmData = {
    /** winAmount */
    winAmount: BigDecimalString;
  };

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

  type CheckInDayVO = {
    /**        */
    checkInDays?: number;
    /**      Enum (GOLD:GOLD,WSP:VTOKEN) */
    rewardType?: 'GOLD' | 'VTOKEN';
    /**      */
    rewardAmount?: BigDecimalString;
    /**      */
    rewardPic?: string;
    /**      Enum (SIGNED:SIGNED,TO_BE_SIGNED:TO_BE_SIGNED,NOT_SIGNED:NOT_SIGNED) */
    checkInStatus?: 'SIGNED' | 'TO_BE_SIGNED' | 'NOT_SIGNED';
  };

  type CheckInInfoVO = {
    /**       ,true     ,false     */
    todayCheckIn?: boolean;
    /** check in enalbe(true =useable,false-disable) */
    useableCheckIn?: boolean;
    /**           */
    nextCheckInTime?: number;
  };

  type completeTaskCenterControllerParams = {
    /** task id,Long   (0~9223372036854775807),    (2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,1001,1002,1003)           */
    taskDict: number;
  };

  type completeTaskControllerParams = {
    /** task id,Long   (0~9223372036854775807) */
    taskId: string;
  };

  type CreateWithdrawalV2AO = {
    /**      Enum (MOCK_CHANNEL:MOCK_CHANNEL,EWALLET_DANA:EWALLET_DANA,EWALLET_GOPAY:EWALLET_GOPAY,EWALLET_LINKAJA:EWALLET_LINKAJA,EWALLET_OVO:EWALLET_OVO,EWALLET_SHOPEEPAY:EWALLET_SHOPEEPAY,QRIS:QRIS,Bank Mandiri (Persero) Tbk:BANK_MANDIRI,PT Bank Permata Tbk:BANK_PERMATA,Bank Negara Indonesia:BANK_BNI,PT Bank CIMB Niaga Tbk:BANK_CIMB,Bank Central Asia Tbk:BANK_BCA,Bank Rakyat Indonesia:BANK_BRI,Bank Syariah Indonesia:BANK_BSI,Bank Danamon Indonesia Tbk :BANK_DANAMON) */
    channel:
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
    /**     (  ) */
    withdrawalAmount: BigDecimalStringAO;
  };

  type CreateWithdrawalV3AO = {
    /**      Enum (MOCK_CHANNEL:MOCK_CHANNEL,EWALLET_DANA:EWALLET_DANA,EWALLET_GOPAY:EWALLET_GOPAY,EWALLET_LINKAJA:EWALLET_LINKAJA,EWALLET_OVO:EWALLET_OVO,EWALLET_SHOPEEPAY:EWALLET_SHOPEEPAY,QRIS:QRIS,Bank Mandiri (Persero) Tbk:BANK_MANDIRI,PT Bank Permata Tbk:BANK_PERMATA,Bank Negara Indonesia:BANK_BNI,PT Bank CIMB Niaga Tbk:BANK_CIMB,Bank Central Asia Tbk:BANK_BCA,Bank Rakyat Indonesia:BANK_BRI,Bank Syariah Indonesia:BANK_BSI,Bank Danamon Indonesia Tbk :BANK_DANAMON) */
    channel:
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
    /**     (  ) */
    withdrawalAmount: BigDecimalStringAO;
    /**      Enum (  :NORMAL,    :INITIAL_BENEFIT,    :SMALL_WITHDRAW,    :LIMIT_WITHDRAW,    :QUEUE_WITHDRAW,activity withdraw:ACTIVITY) */
    withdrawType:
      | 'NORMAL'
      | 'INITIAL_BENEFIT'
      | 'SMALL_WITHDRAW'
      | 'LIMIT_WITHDRAW'
      | 'QUEUE_WITHDRAW'
      | 'ACTIVITY';
    /**     */
    countryCode?: number;
    /**    (   /   ) */
    channelNumber?: string;
    /** withdraw source, may empty */
    source?: string;
    /** activity type Enum (First Recharge:FIRST_CHARGE,Check in:SIGN_IN,Lucky Wheel:TURNTABLE,Higgs:HIGGS,7 Days Event:SEVEN_DAY_ACTIVITIES,Ranking:RANKING_LIST,PAY:PAY,TASK:GAME_HALL_TASK,BankruptCY:BANKRUPTCY_ACTIVITY,special recharge:SPECIAL_RECHARGE,Tomorrow gift:TOMORROW_GIFT,fission task:FISSION_TASK,novice 5 days tasks:NOVICE_FIVE_DAYS,week recharge:WEEK_RECHARGE,growth plan:GROWTH_PLAN,recovery recharge gift:RECOVERY_RECHARGE,welfare entry:WELFARE_ENTRY,Game Invite:GAME_INVITE,topup entry:TOPUP_ENTRY,recovery smash egg:RECOVERY_SMASH_EGG,pay activities entry:PAY_ENTRY,benefit:BENEFIT) */
    activityType?:
      | 'FIRST_CHARGE'
      | 'SIGN_IN'
      | 'TURNTABLE'
      | 'HIGGS'
      | 'SEVEN_DAY_ACTIVITIES'
      | 'RANKING_LIST'
      | 'PAY'
      | 'GAME_HALL_TASK'
      | 'BANKRUPTCY_ACTIVITY'
      | 'SPECIAL_RECHARGE'
      | 'TOMORROW_GIFT'
      | 'FISSION_TASK'
      | 'NOVICE_FIVE_DAYS'
      | 'WEEK_RECHARGE'
      | 'GROWTH_PLAN'
      | 'RECOVERY_RECHARGE'
      | 'WELFARE_ENTRY'
      | 'GAME_INVITE'
      | 'TOPUP_ENTRY'
      | 'RECOVERY_SMASH_EGG'
      | 'PAY_ENTRY'
      | 'BENEFIT';
  };

  type DailyCoinPriceLogVO = {
    /**   Id */
    id?: string;
    /**      */
    createdDate?: number;
    /**      */
    modifiedDate?: number;
    /**      */
    dateTimestamp?: string;
    /** dst usdt（1dst=0.1u） */
    dstToUsdt?: BigDecimalString;
    /** dst RP  （1dst=2000rp */
    dstToRp?: BigDecimalString;
  };

  type detailProductControllerParams = {
    /** product ID,Long   (0~9223372036854775807) */
    id?: string;
  };

  type doneTaskCenterControllerParams = {
    /** task id,Long   (0~9223372036854775807),    (2001,2002,2004,2009,2010,2011,2012,2013)           */
    taskDict: number;
  };

  type enterGameGameHallControllerParams = {
    /** game Id,Long   (0~9223372036854775807) */
    gameId: string;
  };

  type FirstRechargeViewVO = {
    /**   ID */
    id?: string;
    /**      */
    reward?: BigDecimalString;
    /**      PropertyConverter(ProductPicConverterEditor) */
    picList?: ActivityPicVO[];
    /**       */
    firstRecharge?: boolean;
    /**      */
    invalidTime?: number;
  };

  type FissionInviteVO = {
    /**    Enum (      :NO_SUCCESSFUL_INVITE,            :NO_TASK_FINISHED,           :ANY_TASK_FINISHED) */
    state?: 'NO_SUCCESSFUL_INVITE' | 'NO_TASK_FINISHED' | 'ANY_TASK_FINISHED';
    /**       */
    tobeIssueReward?: BigDecimalString;
    /**       */
    tobeClaimReward?: BigDecimalString;
    /**       */
    claimedReward?: BigDecimalString;
  };

  type FissionSevenDaysTaskConfigVO = {
    /**   id */
    nameId?: string;
    /**    */
    name?: string;
    /**   id */
    iconId?: string;
    /**    PropertyConverter(UploadKeyConverterEditor) */
    icon?: string;
    /**        */
    propRewards?: PropRewardDetailVO[];
    /**     */
    currentValue?: BigDecimalString;
    /**     */
    targetValue?: BigDecimalString;
    /**        Enum (      s:second,      :count) */
    targetValueUnit?: 'second' | 'count';
    /**   id */
    descriptionId?: string;
    /**    */
    description?: string;
    /**         :13                */
    startTime?: string;
    /**         :13    (-1:  ) */
    endTime?: string;
    /**      Enum (   :FINISHED,   :AVAILABLE,   :UNDERWAY,   :NOT_STARTED,   :TIMEOUT,     :NOT_TAKEN) */
    status?:
      | 'FINISHED'
      | 'AVAILABLE'
      | 'UNDERWAY'
      | 'NOT_STARTED'
      | 'TIMEOUT'
      | 'NOT_TAKEN';
    /**      */
    level?: number;
    /**      Enum (INVITE:INVITE,RECHARGE:RECHARGE,BET:BET,WATCH:WATCH,NAVIGATION:NAVIGATION,LOGIN:LOGIN,PLAY:PLAY,ACTIVITY:ACTIVITY,WIN:WIN) */
    behaviorType?:
      | 'INVITE'
      | 'RECHARGE'
      | 'BET'
      | 'WATCH'
      | 'NAVIGATION'
      | 'LOGIN'
      | 'PLAY'
      | 'ACTIVITY'
      | 'WIN';
    /**      */
    url?: string;
    /**      Enum (OUTER LINK:OUTER_LINK,APP LINK:APP_LINK) */
    opType?: 'OUTER_LINK' | 'APP_LINK';
    /**        */
    autoReport?: boolean;
    /**          */
    autoReward?: boolean;
    /**    (1-7) */
    days?: number;
  };

  type GameCenterTaskSeriesVO = {
    /**      Enum (DAILY:DAILY,NEWHAND:NEWHAND) */
    taskType?: 'DAILY' | 'NEWHAND';
    /**      */
    tasks?: TaskItemVO[];
    /**      */
    expirationTime?: string;
  };

  type GameCreatePayInAO = {
    /**   ID */
    productId?: string;
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
    /**   ID */
    gameId?: string;
    /**   URL */
    returnUrl?: string;
  };

  type GameCreatePayInVO = {
    /**      */
    orderId?: string;
    /**      */
    requestPayUrl?: string;
    /** VA   */
    vaNumber?: string;
    /**       */
    vaName?: string;
    /**       */
    vaIcon?: string;
    product?: ProductUserVO;
  };

  type GameFeedbackAO = {
    /**    */
    pics?: string[];
    /**      */
    email: string;
    /**      */
    scene?: string;
    /**      */
    description: string;
  };

  type GameFloatBallVO = {
    /**   Id */
    id?: string;
    /**    */
    state?: boolean;
    /**   id */
    iconId?: string;
    /**   URL PropertyConverter(UploadKeyConverterEditor) */
    icon?: string;
    /** x   ，LEFT: ， RIGHT:  */
    directX?: string;
    /** x    */
    distanceX?: number;
    /** y   ，UP: ， DOWN:  */
    directY?: string;
    /** y    */
    distanceY?: number;
  };

  type GameInfoVO = {
    /**   Id */
    id?: string;
    /**      */
    createdDate?: number;
    /**      */
    modifiedDate?: number;
    /**    */
    name?: string;
    /**   （   ） */
    nameId?: string;
    /**    PropertyConverter(UploadKeyConverterEditor) */
    icon?: string;
    /**   Id */
    iconId?: string;
    /**      Enum (H5:H5) */
    type?: 'H5';
    /**      */
    content?: string;
    /**     (1         ) */
    conversionRatio?: BigDecimalString;
    /**           */
    authorization?: boolean;
    /**      --    */
    publish?: boolean;
    /**        Enum (ONLINE:ONLINE,MAINTENANCE:MAINTENANCE,TESTING:TESTING,OFFLINE:OFFLINE) */
    gameState?: 'ONLINE' | 'MAINTENANCE' | 'TESTING' | 'OFFLINE';
    /**          */
    isReconnectSupported?: boolean;
    /**       ，     */
    sort?: number;
    /**     ID */
    gameProviderId?: string;
    /**        Enum (  :TIANJIAN,  :CHENGDU,PP:PRAGMATIC_PLAYER,PG:POCKET_GAME,JL:JL) */
    gameProviderType?:
      | 'TIANJIAN'
      | 'CHENGDU'
      | 'PRAGMATIC_PLAYER'
      | 'POCKET_GAME'
      | 'JL';
    /**     ,GameTypeEnum Enum (SLOTS:SLOTS,DOMINO:DUMINU,FISHING:BUYU) */
    gameType?: 'SLOTS' | 'DUMINU' | 'BUYU';
    /**       */
    admissionFee?: BigDecimalString;
    /**        */
    buyInGameCoinLimit?: BigDecimalString;
    /**     */
    reserveAmount?: BigDecimalString;
    /**       */
    initReserveAmount?: BigDecimalString;
    /**      GameId */
    externalGameId?: string;
    /**        , GameOrientationEnum Enum (HORIZONTAL:HORIZONTAL,VERTICAL:VERTICAL) */
    orientation?: 'HORIZONTAL' | 'VERTICAL';
    /**         */
    floatBall?: boolean;
    /**           */
    floatBallCoord?: string;
    /**           */
    exitGameButton?: boolean;
    /**             */
    exitGameButtonCoord?: string;
    /**   ip    PropertyConverter(ListStringConverterEditor) */
    ips?: string[];
    /**    */
    coord?: string;
    /** subscript type Enum (NONE:NONE,HOT:HOT,NEW:NEW) */
    subscriptType?: 'NONE' | 'HOT' | 'NEW';
    /**      PropertyConverter(ListStringConverterEditor) */
    userTypes?: Record<string, any>[];
  };

  type GameInviteRecordVO = {
    /**   id */
    userId?: string;
    /**    */
    nickName?: string;
    /**    */
    remark?: string;
    /**      */
    gameLevel?: number;
    /**      */
    timestamp?: string;
    /**        */
    inviteNumber?: number;
  };

  type GameInviteUserInfoVO = {
    /**       */
    totalReward?: BigDecimalString;
    /**    Enum (GOLD:GOLD,WSP:VTOKEN,Bonus GOLD:BONUS_GOLD) */
    coin?: 'GOLD' | 'VTOKEN' | 'BONUS_GOLD';
    /**            */
    inviteUserNumber?: number;
    /**        */
    inviterNickName?: string;
    /**     userId */
    inviterUserId?: string;
    /**      Enum (General User:zero,Game Rising Star:one,Game Ambassador:two,Game Agent:three,Game partner:four) */
    gameLevel?: 'zero' | 'one' | 'two' | 'three' | 'four';
    /**         Enum (General User:zero,Game Rising Star:one,Game Ambassador:two,Game Agent:three,Game partner:four) */
    inviterGameLevel?: 'zero' | 'one' | 'two' | 'three' | 'four';
  };

  type GamePayInOrderVO = {
    /**     */
    orderId?: string;
    /**      */
    productName?: string;
    /**      */
    amount?: BigDecimalString;
    /**       */
    toNum?: BigDecimalString;
    /**      */
    createdDate?: number;
    /**      Enum (    :PAY_CREATE,   :PAY_ING,    :PAY_SUCCESS,      :PAY_FAILED,    :PAY_CANCEL,   :PAY_REFUND,    :PAY_CLOSED,   :PAY_QUEUE,    :PAY_UPSTREAM,    ，    :PAY_AUDIT_PASSED,  ，       :PAY_CREATE_FAILED,    ，    :PAY_CREATE_AUTO,        :PAY_ALL,    :status) */
    status?:
      | 'PAY_CREATE'
      | 'PAY_ING'
      | 'PAY_SUCCESS'
      | 'PAY_FAILED'
      | 'PAY_CANCEL'
      | 'PAY_REFUND'
      | 'PAY_CLOSED'
      | 'PAY_QUEUE'
      | 'PAY_UPSTREAM'
      | 'PAY_AUDIT_PASSED'
      | 'PAY_CREATE_FAILED'
      | 'PAY_CREATE_AUTO'
      | 'PAY_ALL';
    /**      */
    failReason?: string;
    /**        */
    userCoinAmount?: BigDecimalString;
  };

  type GameRollMessageQueueVO = {
    /**   Id */
    id?: string;
    /**      */
    createdDate?: number;
    /**      */
    modifiedDate?: number;
    /**    */
    scenes: ('HALL' | 'ALL_GAME' | 'SPECIFIED_GAMES')[];
    /**   Ids PropertyConverter(ListLongConverterEditor) */
    gameIds?: string[];
    /**      */
    message?: string;
  };

  type GameRoundVO = {
    /** accessToken */
    accessToken?: string;
    /**     */
    openId?: string;
  };

  type GameRunAO = {
    /**   Id */
    gameId: string;
  };

  type GameStartInfoVO = {
    /**   ID */
    gameId?: string;
    /**       ，    */
    gameLoginUrl?: string;
    /** login url content type Enum (URL,HTML_CONTENT) */
    loginUrlContentType?: 'URL' | 'HTML_CONTENT';
    /**    ，HORIZONTAL：  、VERTICAL：   Enum (HORIZONTAL:HORIZONTAL,VERTICAL:VERTICAL) */
    orientation?: 'HORIZONTAL' | 'VERTICAL';
    /**        ,TIANJIAN：  ，CHENGDU：  ，PRAGMATIC_PLAYER：PP Enum (  :TIANJIAN,  :CHENGDU,PP:PRAGMATIC_PLAYER,PG:POCKET_GAME,JL:JL) */
    gameProviderType?:
      | 'TIANJIAN'
      | 'CHENGDU'
      | 'PRAGMATIC_PLAYER'
      | 'POCKET_GAME'
      | 'JL';
    /**     */
    openId?: string;
    gameFloatBall?: GameFloatBallVO;
    /**         */
    floatBallButton?: boolean;
    /**           */
    exitGameButton?: boolean;
    /**             */
    exitGameButtonCoord?: string;
    /**    */
    coord?: string;
    /**           */
    floatBallCoord?: string;
  };

  type GameUserInviteDetailPageAO = {
    /**     (  :1) */
    pageIndex?: number;
    /**     (  :8) */
    pageSize?: number;
    /**     :1-      ，2-      ，3-       */
    sortType: number;
  };

  type gameWithdrawalGoldInfoByTypeWithdrawalControllerParams = {
    ao?: WithdrawalPageQueryAO;
  };

  type getGameRoundInfoGameHallControllerParams = {
    /** game Id,Long   (0~9223372036854775807) */
    gameId: string;
  };

  type getGameSettlementRoundInfoGameHallControllerParams = {
    openId?: string;
  };

  type getGameStartInfoGameHallControllerParams = {
    /** game Id,Long   (0~9223372036854775807) */
    gameId: string;
  };

  type getSettlementInfoGameHallControllerParams = {
    openId?: string;
  };

  type getSettlementInfoV2GameHallControllerParams = {
    openId?: string;
  };

  type getSettlementInfoV3GameHallControllerParams = {
    /** open id,  (1~255) */
    openId: string;
  };

  type getSettlementStatusGameHallControllerParams = {
    openId?: string;
  };

  type IdVO = {
    /**   Id */
    id?: string;
  };

  type IncomeDetailListVO = {
    /**   Id */
    id?: string;
    /**      */
    createdDate?: number;
    /**      */
    modifiedDate?: number;
    /**      Enum (GOLD:GOLD,WSP:VTOKEN,Bonus GOLD:BONUS_GOLD) */
    incomeType?: 'GOLD' | 'VTOKEN' | 'BONUS_GOLD';
    /**      Enum (DIRECT:DIRECT,INDIRECT:INDIRECT,THREE LAYERS:THREE_LAYERS) */
    inviteType?: 'DIRECT' | 'INDIRECT' | 'THREE_LAYERS';
    /**      */
    inviteDescription?: string;
    /**        */
    rechargeAmount?: BigDecimalString;
    /**      */
    incomeAmount?: BigDecimalString;
    /**       ID */
    sourceUserId?: string;
    /**          /VToken   */
    currentAmount?: BigDecimalString;
    /**      */
    incomeTime?: number;
  };

  type IncomeDetailPageAO = {
    /**     (  :1) */
    pageIndex?: number;
    /**     (  :8) */
    pageSize?: number;
    /**      */
    startTime?: number;
    /**      */
    endTime?: number;
    /**      Enum (    :GOLD,DST  :VTOKEN,    :DIRECT,    :INDIRECT) */
    incomeDetailType?: 'GOLD' | 'VTOKEN' | 'DIRECT' | 'INDIRECT';
  };

  type IncomeDetailStatVO = {
    /**       */
    totalGoldIncomeAmount?: BigDecimalString;
    /** Dst    */
    totalDstIncomeAmount?: BigDecimalString;
  };

  type IncomeInfoViewVO = {
    /**         */
    directGiftBagNum?: number;
    /**       */
    directRechargeNum?: BigDecimalString;
    /**           */
    inDirectGiftBagNum?: number;
    /**         */
    inDirectRechargeNum?: BigDecimalString;
    /**        */
    giftBagAccumulationIncome?: BigDecimalString;
    /**        */
    rechargeAccumulationIncome?: BigDecimalString;
  };

  type IncomeLogPageAO = {
    /**     (  :1) */
    pageIndex?: number;
    /**     (  :8) */
    pageSize?: number;
    /**      */
    startTime: number;
    /**      */
    endTime?: number;
    /**      Enum (DIRECT:DIRECT,INDIRECT:INDIRECT,THREE LAYERS:THREE_LAYERS) */
    inviteType?: 'DIRECT' | 'INDIRECT' | 'THREE_LAYERS';
  };

  type IncomeLogVO = {
    /**   Id */
    id?: string;
    /**      */
    createdDate?: number;
    /**      */
    modifiedDate?: number;
    /**   ID */
    userId?: string;
    /**      Enum (DIRECT:DIRECT,INDIRECT:INDIRECT,THREE LAYERS:THREE_LAYERS) */
    inviteType?: 'DIRECT' | 'INDIRECT' | 'THREE_LAYERS';
    /**      Enum (    :DIRECT_BAG,    :DIRECT_RECHARGE,    :INDIRECT_BAG,    :INDIRECT_RECHARGE) */
    incomeType?:
      | 'DIRECT_BAG'
      | 'DIRECT_RECHARGE'
      | 'INDIRECT_BAG'
      | 'INDIRECT_RECHARGE';
    /**        */
    amount?: BigDecimalString;
    /**        */
    income?: BigDecimalString;
    /**       ID */
    sourceUserId?: string;
  };

  type InviteFlipCardItemClientVO = {
    /**      */
    idx?: number;
    /**     id */
    propId?: string;
    /**      */
    propNum?: BigDecimalString;
    propProduct?: PropProductVO;
  };

  type InviteFlipCardVO = {
    /** Number of flops remaining today */
    remainTimes?: number;
    /** The amount of subordinate code required for the invitation to succeed */
    spendThreshold?: BigDecimalString;
    /** Minimum number of invitees */
    inviteNum?: number;
    /** Flop items */
    items?: InviteFlipCardItemClientVO[];
  };

  type InviteFriendInfoItemVO = {
    /**   Id */
    id?: string;
    /**      */
    createdDate?: number;
    /**      */
    modifiedDate?: number;
    /**      userId */
    userId?: string;
    /**       */
    finished?: boolean;
  };

  type InviteShareVO = {
    /**      Enum (General User:zero,Game Rising Star:one,Game Ambassador:two,Game Agent:three,Game partner:four) */
    currentLevel?: 'zero' | 'one' | 'two' | 'three' | 'four';
    /**           */
    directRechargeCount?: number;
    /**       Enum (General User:zero,Game Rising Star:one,Game Ambassador:two,Game Agent:three,Game partner:four) */
    nextLevel?: 'zero' | 'one' | 'two' | 'three' | 'four';
    /**             */
    nextLevelNeedRechargeUser?: number;
    /**            */
    nextLevelIncomeRatio?: BigDecimalString;
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

  type ListVOActivitiesManagementVO = {
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
    data: ActivitiesManagementVO[];
  };

  type ListVOCheckInDayVO = {
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
    data: CheckInDayVO[];
  };

  type ListVOGameCenterTaskSeriesVO = {
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
    data: GameCenterTaskSeriesVO[];
  };

  type ListVOGameInfoVO = {
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
    data: GameInfoVO[];
  };

  type ListVOGameRollMessageQueueVO = {
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
    data: GameRollMessageQueueVO[];
  };

  type ListVOLuckyWheelVO = {
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
    data: LuckyWheelVO[];
  };

  type ListVOPointsRedemptionConfigVO = {
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
    data: PointsRedemptionConfigVO[];
  };

  type ListVOTaskGroupStatusVO = {
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
    data: TaskGroupStatusVO[];
  };

  type ListVOTaskItemVO = {
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
    data: TaskItemVO[];
  };

  type ListVOTaskRewardVO = {
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
    data: TaskRewardVO[];
  };

  type ListVOTaskSeriesVO = {
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
    data: TaskSeriesVO[];
  };

  type ListVOUserCoinAssetsVO = {
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
    data: UserCoinAssetsVO[];
  };

  type ListVOUserExpLevelRuleVO = {
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
    data: UserExpLevelRuleVO[];
  };

  type ListVOUserGameInviteRewardListVO = {
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
    data: UserGameInviteRewardListVO[];
  };

  type ListVOUserMessageCollectRewardVO = {
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
    data: UserMessageCollectRewardVO[];
  };

  type ListVOWithdrawalTopNVO = {
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
    data: WithdrawalTopNVO[];
  };

  type luckWheelUserLuckyWheelLogControllerParams = {
    /** Lucky Wheel Type,Enum (       :FREE,     :GOLD,     :DIAMOND) */
    luckyWheelType: 'FREE' | 'GOLD' | 'DIAMOND';
  };

  type LuckyWheelItemVO = {
    /**      */
    idx?: number;
    /**    PropertyConverter(UploadKeyConverterEditor) */
    icon?: string;
    /**    Enum (GOLD:GOLD,WSP:VTOKEN,Bonus GOLD:BONUS_GOLD) */
    coin?: 'GOLD' | 'VTOKEN' | 'BONUS_GOLD';
    /**       */
    amount?: BigDecimalString;
    /**       */
    odds?: number;
  };

  type LuckyWheelSpinAO = {
    /**       Enum (       :FREE,     :GOLD,     :DIAMOND) */
    luckyWheelType: 'FREE' | 'GOLD' | 'DIAMOND';
  };

  type LuckyWheelVO = {
    /**       Enum (       :FREE,     :GOLD,     :DIAMOND) */
    luckyWheelType?: 'FREE' | 'GOLD' | 'DIAMOND';
    /**       */
    items?: LuckyWheelItemVO[];
    /**       SPIN   */
    freeSpinCount?: number;
    /** SPIN        Enum (GOLD:GOLD,WSP:VTOKEN,Bonus GOLD:BONUS_GOLD) */
    coin?: 'GOLD' | 'VTOKEN' | 'BONUS_GOLD';
    /** SPIN      */
    amount?: BigDecimalString;
  };

  type MemberListVO = {
    /**     ID */
    userId?: string;
    /**        */
    nickname?: string;
    /**      */
    rechargeAmount?: BigDecimalString;
    /**      */
    inviteTime?: string;
    /**         */
    childNo?: number;
  };

  type MessageRewardItemVO = {
    /**      Enum (GOLD:GOLD,WSP:VTOKEN) */
    rewardType?: 'GOLD' | 'VTOKEN';
    /**      */
    amount?: BigDecimalString;
  };

  type normalRechargeGetPayGiftControllerParams = {
    /** activity type,Enum (First Recharge:FIRST_CHARGE,Check in:SIGN_IN,Lucky Wheel:TURNTABLE,Higgs:HIGGS,7 Days Event:SEVEN_DAY_ACTIVITIES,Ranking:RANKING_LIST,PAY:PAY,TASK:GAME_HALL_TASK,BankruptCY:BANKRUPTCY_ACTIVITY,special recharge:SPECIAL_RECHARGE,Tomorrow gift:TOMORROW_GIFT,fission task:FISSION_TASK,novice 5 days tasks:NOVICE_FIVE_DAYS,week recharge:WEEK_RECHARGE,growth plan:GROWTH_PLAN,recovery recharge gift:RECOVERY_RECHARGE,welfare entry:WELFARE_ENTRY,Game Invite:GAME_INVITE,topup entry:TOPUP_ENTRY,recovery smash egg:RECOVERY_SMASH_EGG,pay activities entry:PAY_ENTRY,benefit:BENEFIT) */
    activityType?:
      | 'FIRST_CHARGE'
      | 'SIGN_IN'
      | 'TURNTABLE'
      | 'HIGGS'
      | 'SEVEN_DAY_ACTIVITIES'
      | 'RANKING_LIST'
      | 'PAY'
      | 'GAME_HALL_TASK'
      | 'BANKRUPTCY_ACTIVITY'
      | 'SPECIAL_RECHARGE'
      | 'TOMORROW_GIFT'
      | 'FISSION_TASK'
      | 'NOVICE_FIVE_DAYS'
      | 'WEEK_RECHARGE'
      | 'GROWTH_PLAN'
      | 'RECOVERY_RECHARGE'
      | 'WELFARE_ENTRY'
      | 'GAME_INVITE'
      | 'TOPUP_ENTRY'
      | 'RECOVERY_SMASH_EGG'
      | 'PAY_ENTRY'
      | 'BENEFIT';
  };

  type ObjectVOActivityDetailsVO = {
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
    data: ActivityDetailsVO;
  };

  type ObjectVOBigDecimal = {
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
    data: BigDecimalString;
  };

  type ObjectVOBindingMobileInfoVO = {
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
    data: BindingMobileInfoVO;
  };

  type ObjectVOBoolean = {
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
    data: boolean;
  };

  type ObjectVOCheckInInfoVO = {
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
    data: CheckInInfoVO;
  };

  type ObjectVOFirstRechargeViewVO = {
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
    data: FirstRechargeViewVO;
  };

  type ObjectVOFissionInviteVO = {
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
    data: FissionInviteVO;
  };

  type ObjectVOGameCreatePayInVO = {
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
    data: GameCreatePayInVO;
  };

  type ObjectVOGameInviteUserInfoVO = {
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
    data: GameInviteUserInfoVO;
  };

  type ObjectVOGamePayInOrderVO = {
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
    data: GamePayInOrderVO;
  };

  type ObjectVOGameRoundVO = {
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
    data: GameRoundVO;
  };

  type ObjectVOGameSettlementStateEnum = {
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
    /**          200   ,Enum (   :WAITING,   :DOING,  :COMPLETED,  :EXCEPTIONAL) */
    data: 'WAITING' | 'DOING' | 'COMPLETED' | 'EXCEPTIONAL';
  };

  type ObjectVOGameStartInfoVO = {
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
    data: GameStartInfoVO;
  };

  type ObjectVOIncomeDetailStatVO = {
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
    data: IncomeDetailStatVO;
  };

  type ObjectVOIncomeInfoViewVO = {
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
    data: IncomeInfoViewVO;
  };

  type ObjectVOInteger = {
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
    data: number;
  };

  type ObjectVOInviteFlipCardVO = {
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
    data: InviteFlipCardVO;
  };

  type ObjectVOInviteShareVO = {
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
    data: InviteShareVO;
  };

  type ObjectVOLong = {
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

  type ObjectVOLuckyWheelVO = {
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
    data: LuckyWheelVO;
  };

  type ObjectVOPayGiftGrowthPlanVO = {
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
    data: PayGiftGrowthPlanVO;
  };

  type ObjectVOPayGiftHallVO = {
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
    data: PayGiftHallVO;
  };

  type ObjectVOPayGiftNormalVO = {
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
    data: PayGiftNormalVO;
  };

  type ObjectVOPayGiftRewardVO = {
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
    data: PayGiftRewardVO;
  };

  type ObjectVOPayGiftTriggerVO = {
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
    data: PayGiftTriggerVO;
  };

  type ObjectVOPayInOrderVO = {
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
    data: PayInOrderVO;
  };

  type ObjectVOPayOutOrderVO = {
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
    data: PayOutOrderVO;
  };

  type ObjectVOProductCarryPayViewVO = {
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
    data: ProductCarryPayViewVO;
  };

  type ObjectVOProductViewVO = {
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
    data: ProductViewVO;
  };

  type ObjectVOPromotionIncomeVO = {
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
    data: PromotionIncomeVO;
  };

  type ObjectVOPropBagItemUserVO = {
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
    data: PropBagItemUserVO;
  };

  type ObjectVORedeemCodeActivateVO = {
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
    data: RedeemCodeActivateVO;
  };

  type ObjectVORunningGameVO = {
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
    data: RunningGameVO;
  };

  type ObjectVOSmashEggActivityVO = {
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
    data: SmashEggActivityVO;
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

  type ObjectVOTaskReportResultVO = {
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
    data: TaskReportResultVO;
  };

  type ObjectVOTaskRewardVO = {
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
    data: TaskRewardVO;
  };

  type ObjectVOTurnTableVO = {
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
    data: TurnTableVO;
  };

  type ObjectVOUploadConfigVO = {
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
    data: UploadConfigVO;
  };

  type ObjectVOUserAccountVO = {
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
    data: UserAccountVO;
  };

  type ObjectVOUserBalanceInfoVO = {
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
    data: UserBalanceInfoVO;
  };

  type ObjectVOUserBusinessInfoVO = {
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
    data: UserBusinessInfoVO;
  };

  type ObjectVOUserCenterVO = {
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
    data: UserCenterVO;
  };

  type ObjectVOUserFissionAssetStatVO = {
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
    data: UserFissionAssetStatVO;
  };

  type ObjectVOUserFissionCheckInActivityVO = {
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
    data: UserFissionCheckInActivityVO;
  };

  type ObjectVOUserFissionTaskVO = {
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
    data: UserFissionTaskVO;
  };

  type ObjectVOUserFissionTeamStatVO = {
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
    data: UserFissionTeamStatVO;
  };

  type ObjectVOUserGameInviteStatVO = {
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
    data: UserGameInviteStatVO;
  };

  type ObjectVOUserGameRoundInfoVO = {
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
    data: UserGameRoundInfoVO;
  };

  type ObjectVOUserMessageHasReadVO = {
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
    data: UserMessageHasReadVO;
  };

  type ObjectVOUserPlayGameStatVO = {
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
    data: UserPlayGameStatVO;
  };

  type ObjectVOUserSettlementBannerVO = {
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
    data: UserSettlementBannerVO;
  };

  type ObjectVOUserStatVO = {
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
    data: UserStatVO;
  };

  type ObjectVOUserTokenLogStatVO = {
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
    data: UserTokenLogStatVO;
  };

  type ObjectVOUserTokenUsableVO = {
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
    data: UserTokenUsableVO;
  };

  type ObjectVOUserWalletInfoVO = {
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
    data: UserWalletInfoVO;
  };

  type ObjectVOUserWalletLevelVO = {
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
    data: UserWalletLevelVO;
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

  type ObjectVOWithdrawQueueUserVO = {
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
    data: WithdrawQueueUserVO;
  };

  type ObjectVOWvFlopInfoVO = {
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
    data: WvFlopInfoVO;
  };

  type PageAO = {
    /**     (  :1) */
    pageIndex?: number;
    /**     (  :8) */
    pageSize?: number;
  };

  type PageVODailyCoinPriceLogVO = {
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
    data: DailyCoinPriceLogVO[];
    /**      */
    total: number;
  };

  type PageVOGameInviteRecordVO = {
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
    data: GameInviteRecordVO[];
    /**      */
    total: number;
  };

  type PageVOIncomeDetailListVO = {
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
    data: IncomeDetailListVO[];
    /**      */
    total: number;
  };

  type PageVOIncomeLogVO = {
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
    data: IncomeLogVO[];
    /**      */
    total: number;
  };

  type PageVOInviteFriendInfoItemVO = {
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
    data: InviteFriendInfoItemVO[];
    /**      */
    total: number;
  };

  type PageVOMemberListVO = {
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
    data: MemberListVO[];
    /**      */
    total: number;
  };

  type PageVOPayInOrderVO = {
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
    data: PayInOrderVO[];
    /**      */
    total: number;
  };

  type PageVOPayOutOrderVO = {
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
    data: PayOutOrderVO[];
    /**      */
    total: number;
  };

  type PageVOPointsRedemptionLogVO = {
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
    data: PointsRedemptionLogVO[];
    /**      */
    total: number;
  };

  type PageVOProductVO = {
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
    data: ProductVO[];
    /**      */
    total: number;
  };

  type PageVOTransactionVO = {
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
    data: TransactionVO[];
    /**      */
    total: number;
  };

  type PageVOUserFissionTeamMemberPageVO = {
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
    data: UserFissionTeamMemberPageVO[];
    /**      */
    total: number;
  };

  type PageVOUserMessageVO = {
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
    data: UserMessageVO[];
    /**      */
    total: number;
  };

  type PageVOUserPropVO = {
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
    data: UserPropVO[];
    /**      */
    total: number;
  };

  type PageVOUserTokenLogVO = {
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
    data: UserTokenLogVO[];
    /**      */
    total: number;
  };

  type PageVOWidthdrawlUserInfoVO = {
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
    data: WidthdrawlUserInfoVO[];
    /**      */
    total: number;
  };

  type PageVOWithdrawalLogVO = {
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
    data: WithdrawalLogVO[];
    /**      */
    total: number;
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

  type PayGiftGrowthPlanVO = {
    /** growth plan status Enum (init status:INIT,month card bought:MONTH_CARD_BOUGHT,growth plan bought:GROWTH_PLAN_BOUGHT) */
    status?: 'INIT' | 'MONTH_CARD_BOUGHT' | 'GROWTH_PLAN_BOUGHT';
    /** growth plan left days after month card buy */
    leftDays?: number;
    /** month card activity id */
    activityId?: string;
    /** month card product price */
    price?: BigDecimalString;
    /** month card immediate give coin num */
    coinNum?: BigDecimalString;
    /** growth plan activity id */
    growthPlanActivityId?: string;
    /** growth plan price */
    growthPlanPrice?: BigDecimalString;
    payGiftReward?: PayGiftRewardItemVO;
  };

  type PayGiftHallActivityVO = {
    /** activity type Enum (First Recharge:FIRST_CHARGE,Check in:SIGN_IN,Lucky Wheel:TURNTABLE,Higgs:HIGGS,7 Days Event:SEVEN_DAY_ACTIVITIES,Ranking:RANKING_LIST,PAY:PAY,TASK:GAME_HALL_TASK,BankruptCY:BANKRUPTCY_ACTIVITY,special recharge:SPECIAL_RECHARGE,Tomorrow gift:TOMORROW_GIFT,fission task:FISSION_TASK,novice 5 days tasks:NOVICE_FIVE_DAYS,week recharge:WEEK_RECHARGE,growth plan:GROWTH_PLAN,recovery recharge gift:RECOVERY_RECHARGE,welfare entry:WELFARE_ENTRY,Game Invite:GAME_INVITE,topup entry:TOPUP_ENTRY,recovery smash egg:RECOVERY_SMASH_EGG,pay activities entry:PAY_ENTRY,benefit:BENEFIT) */
    activitiesType?:
      | 'FIRST_CHARGE'
      | 'SIGN_IN'
      | 'TURNTABLE'
      | 'HIGGS'
      | 'SEVEN_DAY_ACTIVITIES'
      | 'RANKING_LIST'
      | 'PAY'
      | 'GAME_HALL_TASK'
      | 'BANKRUPTCY_ACTIVITY'
      | 'SPECIAL_RECHARGE'
      | 'TOMORROW_GIFT'
      | 'FISSION_TASK'
      | 'NOVICE_FIVE_DAYS'
      | 'WEEK_RECHARGE'
      | 'GROWTH_PLAN'
      | 'RECOVERY_RECHARGE'
      | 'WELFARE_ENTRY'
      | 'GAME_INVITE'
      | 'TOPUP_ENTRY'
      | 'RECOVERY_SMASH_EGG'
      | 'PAY_ENTRY'
      | 'BENEFIT';
    /** activity status Enum (can buy:CAN_BUY,can receive, not to receive time:CAN_RECEIVE_NOT_TIME,can receive:CAN_RECEIVE,all received:ALL_RECEIVED,some received but expired:CAN_NOT_RECEIVE_FOR_EXPIRED,no triggered:NO_NEW_TRIGGERED) */
    status?:
      | 'CAN_BUY'
      | 'CAN_RECEIVE_NOT_TIME'
      | 'CAN_RECEIVE'
      | 'ALL_RECEIVED'
      | 'CAN_NOT_RECEIVE_FOR_EXPIRED'
      | 'NO_NEW_TRIGGERED';
    /** end time */
    endTime?: number;
  };

  type PayGiftHallVO = {
    /** activities */
    activityVos?: PayGiftHallActivityVO[];
  };

  type PayGiftNormalVO = {
    /** activity id */
    activityId?: string;
    /** product list info */
    productList?: PayProductBasicVO[];
  };

  type PayGiftReceiveRewardAO = {
    /** activity id */
    activityId: string;
    /** reward id */
    rewardId: number;
  };

  type PayGiftRewardItemVO = {
    /** reward id */
    rewardId?: number;
    /** reward type Enum (GOLD:GOLD,WSP:VTOKEN,Bonus GOLD:BONUS_GOLD) */
    rewardType?: 'GOLD' | 'VTOKEN' | 'BONUS_GOLD';
    /** reward amount */
    rewardAmount?: BigDecimalString;
    /** reward status Enum (can not receive:CAN_NOT_RECEIVE,can receive, not to receive time:CAN_RECEIVE_NOT_TIME,can receive:CAN_RECEIVE,has received:HAS_RECEIVED) */
    rewardStatus?:
      | 'CAN_NOT_RECEIVE'
      | 'CAN_RECEIVE_NOT_TIME'
      | 'CAN_RECEIVE'
      | 'HAS_RECEIVED';
    /** reward receive begin time */
    rewardReceiveTime?: number;
  };

  type PayGiftRewardVO = {
    /** has buy, false-can buy new, true-can not buy new */
    hasBuy?: boolean;
    /** activity id */
    activityId?: string;
    /** product price */
    price?: BigDecimalString;
    /** product coin num */
    coinNum?: BigDecimalString;
    /** pay gift activity rewards view */
    payGiftActivityRewardsView?: PayGiftRewardItemVO[];
  };

  type PayGiftTriggerAO = {
    /** trigger type Enum (game betting not enough:GAME_BET_NOT_ENOUGH,game settle not enough:GAME_SETTLE_NOT_ENOUGH,play lucky wheel not enough:LUCKY_WHEEL_NOT_ENOUGH,game loss trigger:GAME_LOSS) */
    triggerType:
      | 'GAME_BET_NOT_ENOUGH'
      | 'GAME_SETTLE_NOT_ENOUGH'
      | 'LUCKY_WHEEL_NOT_ENOUGH'
      | 'GAME_LOSS';
    /** play game id */
    gameId?: string;
  };

  type PayGiftTriggerVO = {
    /** activity type Enum (First Recharge:FIRST_CHARGE,Check in:SIGN_IN,Lucky Wheel:TURNTABLE,Higgs:HIGGS,7 Days Event:SEVEN_DAY_ACTIVITIES,Ranking:RANKING_LIST,PAY:PAY,TASK:GAME_HALL_TASK,BankruptCY:BANKRUPTCY_ACTIVITY,special recharge:SPECIAL_RECHARGE,Tomorrow gift:TOMORROW_GIFT,fission task:FISSION_TASK,novice 5 days tasks:NOVICE_FIVE_DAYS,week recharge:WEEK_RECHARGE,growth plan:GROWTH_PLAN,recovery recharge gift:RECOVERY_RECHARGE,welfare entry:WELFARE_ENTRY,Game Invite:GAME_INVITE,topup entry:TOPUP_ENTRY,recovery smash egg:RECOVERY_SMASH_EGG,pay activities entry:PAY_ENTRY,benefit:BENEFIT) */
    activitiesType?:
      | 'FIRST_CHARGE'
      | 'SIGN_IN'
      | 'TURNTABLE'
      | 'HIGGS'
      | 'SEVEN_DAY_ACTIVITIES'
      | 'RANKING_LIST'
      | 'PAY'
      | 'GAME_HALL_TASK'
      | 'BANKRUPTCY_ACTIVITY'
      | 'SPECIAL_RECHARGE'
      | 'TOMORROW_GIFT'
      | 'FISSION_TASK'
      | 'NOVICE_FIVE_DAYS'
      | 'WEEK_RECHARGE'
      | 'GROWTH_PLAN'
      | 'RECOVERY_RECHARGE'
      | 'WELFARE_ENTRY'
      | 'GAME_INVITE'
      | 'TOPUP_ENTRY'
      | 'RECOVERY_SMASH_EGG'
      | 'PAY_ENTRY'
      | 'BENEFIT';
    /** pay product type Enum (general:GENERAL,firstRecharge:ACTIVITY,bankruptcy:BANKRUPTCY,special:SPECIAL,week recharge:WEEK,month card:MONTH,recovery:RECOVERY,growth plan:GROWTH) */
    productType?:
      | 'GENERAL'
      | 'ACTIVITY'
      | 'BANKRUPTCY'
      | 'SPECIAL'
      | 'WEEK'
      | 'MONTH'
      | 'RECOVERY'
      | 'GROWTH';
    /** activity ID */
    activityId?: string;
  };

  type payInCheckPayControllerParams = {
    /** Order ID,  (1~255) */
    orderId: string;
  };

  type payInCheckProductControllerParams = {
    /** Order ID,  (1~255) */
    orderId: string;
    /** Recharge product type,Enum (    :PAY_PRODUCT_COIN,     :PAY_PRODUCT_COIN_GAME,    :PAY_PRODUCT_COIN_FIRST) */
    type:
      | 'PAY_PRODUCT_COIN'
      | 'PAY_PRODUCT_COIN_GAME'
      | 'PAY_PRODUCT_COIN_FIRST';
  };

  type PayInOrderVO = {
    /**   Id */
    id?: string;
    /**      */
    createdDate?: number;
    /**      */
    modifiedDate?: number;
    /**     */
    orderId?: string;
    /**      */
    productName?: string;
    /**      */
    amount?: BigDecimalString;
    /**      Enum (    :PAY_CREATE,   :PAY_ING,    :PAY_SUCCESS,      :PAY_FAILED,    :PAY_CANCEL,   :PAY_REFUND,    :PAY_CLOSED,   :PAY_QUEUE,    :PAY_UPSTREAM,    ，    :PAY_AUDIT_PASSED,  ，       :PAY_CREATE_FAILED,    ，    :PAY_CREATE_AUTO,        :PAY_ALL,    :status) */
    status?:
      | 'PAY_CREATE'
      | 'PAY_ING'
      | 'PAY_SUCCESS'
      | 'PAY_FAILED'
      | 'PAY_CANCEL'
      | 'PAY_REFUND'
      | 'PAY_CLOSED'
      | 'PAY_QUEUE'
      | 'PAY_UPSTREAM'
      | 'PAY_AUDIT_PASSED'
      | 'PAY_CREATE_FAILED'
      | 'PAY_CREATE_AUTO'
      | 'PAY_ALL';
    /**      */
    failReason?: string;
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

  type payOutCheckPayControllerParams = {
    /** Order ID,  (1~255) */
    orderId: string;
  };

  type PayOutOrderVO = {
    /**   Id */
    id?: string;
    /**      */
    createdDate?: number;
    /**      */
    modifiedDate?: number;
    /**       */
    orderId?: string;
    /**      */
    amount?: BigDecimalString;
    /**      */
    userName?: string;
    /**       &     */
    userAccountNumber?: string;
    /**      Enum (    :PAY_CREATE,   :PAY_ING,    :PAY_SUCCESS,      :PAY_FAILED,    :PAY_CANCEL,   :PAY_REFUND,    :PAY_CLOSED,   :PAY_QUEUE,    :PAY_UPSTREAM,    ，    :PAY_AUDIT_PASSED,  ，       :PAY_CREATE_FAILED,    ，    :PAY_CREATE_AUTO,        :PAY_ALL,    :status) */
    status?:
      | 'PAY_CREATE'
      | 'PAY_ING'
      | 'PAY_SUCCESS'
      | 'PAY_FAILED'
      | 'PAY_CANCEL'
      | 'PAY_REFUND'
      | 'PAY_CLOSED'
      | 'PAY_QUEUE'
      | 'PAY_UPSTREAM'
      | 'PAY_AUDIT_PASSED'
      | 'PAY_CREATE_FAILED'
      | 'PAY_CREATE_AUTO'
      | 'PAY_ALL';
  };

  type PayProductBasicVO = {
    /** price */
    price?: BigDecimalString;
    /** basic coin num */
    num?: BigDecimalString;
    /** give coin num */
    giveCoinNum?: BigDecimalString;
    /** flag Enum (REGULAR:REGULAR,HOT:HOT,NEW:NEW,LIMIT:LIMIT) */
    flag?: 'REGULAR' | 'HOT' | 'NEW' | 'LIMIT';
  };

  type PayTypeVO = {
    /**    */
    name?: string;
    /**    */
    icon?: string;
    /**    */
    type?: string;
    /**      */
    bankList?: PayTypeVO[];
  };

  type PointsRedemptionAO = {
    /**   ID */
    id: string;
    /**   ID */
    targetId?: string;
    /**     */
    mobile?: string;
    /** nickname */
    nickname?: string;
  };

  type PointsRedemptionConfigPageAO = {
    /**     (  :1) */
    pageIndex?: number;
    /**     (  :8) */
    pageSize?: number;
  };

  type PointsRedemptionConfigVO = {
    /**   Id */
    id?: string;
    /**      */
    createdDate?: number;
    /**      */
    modifiedDate?: number;
    /**    */
    idx?: number;
    /**      Enum (HIGGS:HIGGS) */
    point?: 'HIGGS';
    /**      */
    label?: string;
    /**          */
    amount?: BigDecimalString;
    /**        Enum (  :PROP) */
    redemptionItemType?: 'PROP';
    /**     ID */
    redemptionItemId?: string;
    /**      Enum (GOLD:GOLD,WSP:VTOKEN,PHONE CHARGE TICKET:PHONE_CHARGE_TICKET,FLOW CARD:FLOW_CARD,HIGGS CARD CHANCE:HIGGS_CARD_CHANCE,HIGGS EXCHANGE TICKET:HIGGS_EXCHANGE_TICKET,BLUETOOTH EARPHONE:BLUETOOTH_EARPHONE,POWER BANK:POWER_BANK,3 IN 1 CHARGING CABLE:THREE_IN_ONE_CHARGING_CABLE) */
    propType?:
      | 'GOLD'
      | 'VTOKEN'
      | 'PHONE_CHARGE_TICKET'
      | 'FLOW_CARD'
      | 'HIGGS_CARD_CHANCE'
      | 'HIGGS_EXCHANGE_TICKET'
      | 'BLUETOOTH_EARPHONE'
      | 'POWER_BANK'
      | 'THREE_IN_ONE_CHARGING_CABLE';
    /**      */
    propName?: string;
    /**        */
    redemptionItemAmount?: number;
    /**          PropertyConverter(UploadKeyConverterEditor) */
    redemptionItemImageUrl?: string;
    /**      Enum (    :DURATION_DAYS,    :PERMANENT) */
    inventoryType?: 'DURATION_DAYS' | 'PERMANENT';
    /**      */
    inventoryAmount?: number;
    /**          */
    inventoryDurationDays?: number;
  };

  type PointsRedemptionLogPageAO = {
    /**     (  :1) */
    pageIndex?: number;
    /**     (  :8) */
    pageSize?: number;
  };

  type PointsRedemptionLogVO = {
    /**   Id */
    id?: string;
    /**      */
    createdDate?: number;
    /**      */
    modifiedDate?: number;
    /**   ID */
    userId?: string;
    /**      Enum (HIGGS:HIGGS) */
    type?: 'HIGGS';
    /**          */
    amount?: BigDecimalString;
    /**        Enum (  :PROP) */
    redemptionItemType?: 'PROP';
    /**        */
    redemptionItemName?: string;
    /**     ID */
    redemptionItemId?: string;
    /**          PropertyConverter(UploadKeyConverterEditor) */
    redemptionItemImageUrl?: string;
    /**        */
    redemptionItemAmount?: number;
    /**  ID */
    sourceId?: string;
    /**    Enum (PENDING:PENDING,PROCESSED:PROCESSED,REJECTED:REJECTED) */
    status?: 'PENDING' | 'PROCESSED' | 'REJECTED';
  };

  type ProductCarryPayViewVO = {
    /**      */
    payTypeList?: PayTypeVO[];
    product?: ProductUserVO;
  };

  type ProductListViewVO = {
    payType?: PayTypeVO;
    /**        */
    generalList?: ProductUserVO[];
    activity?: ProductUserVO;
    /**       */
    bankList?: PayTypeVO[];
  };

  type ProductPageAO = {
    /**     (  :1) */
    pageIndex?: number;
    /**     (  :8) */
    pageSize?: number;
    /** productId */
    id?: string;
    /** channel type Enum (MOCK_CHANNEL:MOCK_CHANNEL,EWALLET_DANA:EWALLET_DANA,EWALLET_GOPAY:EWALLET_GOPAY,EWALLET_LINKAJA:EWALLET_LINKAJA,EWALLET_OVO:EWALLET_OVO,EWALLET_SHOPEEPAY:EWALLET_SHOPEEPAY,QRIS:QRIS,VA:VA) */
    payType?:
      | 'MOCK_CHANNEL'
      | 'EWALLET_DANA'
      | 'EWALLET_GOPAY'
      | 'EWALLET_LINKAJA'
      | 'EWALLET_OVO'
      | 'EWALLET_SHOPEEPAY'
      | 'QRIS'
      | 'VA';
    /** product type Enum (general:GENERAL,firstRecharge:ACTIVITY,bankruptcy:BANKRUPTCY,special:SPECIAL,week recharge:WEEK,month card:MONTH,recovery:RECOVERY,growth plan:GROWTH) */
    type?:
      | 'GENERAL'
      | 'ACTIVITY'
      | 'BANKRUPTCY'
      | 'SPECIAL'
      | 'WEEK'
      | 'MONTH'
      | 'RECOVERY'
      | 'GROWTH';
    /** disable */
    disable?: boolean;
  };

  type ProductUserVO = {
    /** product id */
    id?: string;
    /**      */
    createdDate?: number;
    /**      */
    modifiedDate?: number;
    /** product language name */
    name?: string;
    /** activity pic list PropertyConverter(ProductPicConverterEditor) */
    picList?: ActivityPicVO[];
    /** product type Enum (general:GENERAL,firstRecharge:ACTIVITY,bankruptcy:BANKRUPTCY,special:SPECIAL,week recharge:WEEK,month card:MONTH,recovery:RECOVERY,growth plan:GROWTH) */
    type?:
      | 'GENERAL'
      | 'ACTIVITY'
      | 'BANKRUPTCY'
      | 'SPECIAL'
      | 'WEEK'
      | 'MONTH'
      | 'RECOVERY'
      | 'GROWTH';
    /** channel type Enum (MOCK_CHANNEL:MOCK_CHANNEL,EWALLET_DANA:EWALLET_DANA,EWALLET_GOPAY:EWALLET_GOPAY,EWALLET_LINKAJA:EWALLET_LINKAJA,EWALLET_OVO:EWALLET_OVO,EWALLET_SHOPEEPAY:EWALLET_SHOPEEPAY,QRIS:QRIS,VA:VA) */
    payType?:
      | 'MOCK_CHANNEL'
      | 'EWALLET_DANA'
      | 'EWALLET_GOPAY'
      | 'EWALLET_LINKAJA'
      | 'EWALLET_OVO'
      | 'EWALLET_SHOPEEPAY'
      | 'QRIS'
      | 'VA';
    /** currency Enum (IDR:IDR) */
    currency?: 'IDR';
    /** price */
    price?: BigDecimalString;
    /** sort */
    sort?: number;
    /** coin type Enum (GOLD:GOLD,WSP:VTOKEN,Bonus GOLD:BONUS_GOLD) */
    coinType?: 'GOLD' | 'VTOKEN' | 'BONUS_GOLD';
    /** original num */
    originalNum?: BigDecimalString;
    /** final coin num */
    num?: BigDecimalString;
    /** flag Enum (REGULAR:REGULAR,HOT:HOT,NEW:NEW,LIMIT:LIMIT) */
    flag?: 'REGULAR' | 'HOT' | 'NEW' | 'LIMIT';
    /** remark */
    remark?: string;
  };

  type ProductViewVO = {
    /**      */
    productList?: ProductListViewVO[];
    /**        */
    userCoinAmount?: BigDecimalString;
  };

  type ProductVO = {
    /** product id */
    id?: string;
    /**      */
    createdDate?: number;
    /**      */
    modifiedDate?: number;
    /** name id */
    nameId?: string;
    /** product type Enum (general:GENERAL,firstRecharge:ACTIVITY,bankruptcy:BANKRUPTCY,special:SPECIAL,week recharge:WEEK,month card:MONTH,recovery:RECOVERY,growth plan:GROWTH) */
    type?:
      | 'GENERAL'
      | 'ACTIVITY'
      | 'BANKRUPTCY'
      | 'SPECIAL'
      | 'WEEK'
      | 'MONTH'
      | 'RECOVERY'
      | 'GROWTH';
    /** channel type Enum (MOCK_CHANNEL:MOCK_CHANNEL,EWALLET_DANA:EWALLET_DANA,EWALLET_GOPAY:EWALLET_GOPAY,EWALLET_LINKAJA:EWALLET_LINKAJA,EWALLET_OVO:EWALLET_OVO,EWALLET_SHOPEEPAY:EWALLET_SHOPEEPAY,QRIS:QRIS,VA:VA) */
    payType?:
      | 'MOCK_CHANNEL'
      | 'EWALLET_DANA'
      | 'EWALLET_GOPAY'
      | 'EWALLET_LINKAJA'
      | 'EWALLET_OVO'
      | 'EWALLET_SHOPEEPAY'
      | 'QRIS'
      | 'VA';
    /** currency Enum (IDR:IDR) */
    currency?: 'IDR';
    /** price */
    price?: BigDecimalString;
    /** coin type Enum (GOLD:GOLD,WSP:VTOKEN,Bonus GOLD:BONUS_GOLD) */
    coinType?: 'GOLD' | 'VTOKEN' | 'BONUS_GOLD';
    /** coin num */
    num?: BigDecimalString;
    /** extra coin type given Enum (PERCENTAGE:PERCENTAGE,NUMBER:NUMBER) */
    givenValueType?: 'PERCENTAGE' | 'NUMBER';
    /** extra coin num given */
    givenValue?: BigDecimalString;
    /** disable */
    disable?: boolean;
    /** sort */
    sort?: number;
    /** flag Enum (REGULAR:REGULAR,HOT:HOT,NEW:NEW,LIMIT:LIMIT) */
    flag?: 'REGULAR' | 'HOT' | 'NEW' | 'LIMIT';
    /** language name text */
    nameText?: string;
  };

  type PromotionIncomeVO = {
    /**      */
    directCount?: number;
    /**        */
    directRechargeCount?: number;
    /**        */
    directSameLevelCount?: number;
    /**       */
    totalRechargeCount?: number;
    /**        */
    directChildCount?: number;
    /**          */
    theMonthGoldIncomeAmount?: BigDecimalString;
    /**         (    RP) */
    theMonthGoldIncomeAmountToCurrency?: BigDecimalString;
    /**     Dst   */
    theMonthDstIncomeAmount?: BigDecimalString;
    /**     Dst  (    RP) */
    theMonthDstIncomeAmountToCurrency?: BigDecimalString;
    /**      Enum (General User:zero,Game Rising Star:one,Game Ambassador:two,Game Agent:three,Game partner:four) */
    currentLevel?: 'zero' | 'one' | 'two' | 'three' | 'four';
    /**             */
    currentLevelDirectIncomeRatio?: BigDecimalString;
    /**             */
    currentLevelInDirectIncomeRatio?: BigDecimalString;
    /**       Enum (General User:zero,Game Rising Star:one,Game Ambassador:two,Game Agent:three,Game partner:four) */
    nextLevel?: 'zero' | 'one' | 'two' | 'three' | 'four';
    /**              */
    nextLevelDirectIncomeRatio?: BigDecimalString;
    /**              */
    nextLevelInDirectIncomeRatio?: BigDecimalString;
    /**             */
    nextLevelNeedRechargeUser?: number;
    /**               */
    nextLevelNeedSameLevelUser?: number;
    /**               */
    levelRechargeUserList?: number[];
  };

  type PropBagItemUserVO = {
    propProduct?: PropProductVO;
    /** prop num */
    propNum?: number;
  };

  type PropProductVO = {
    /**   Id */
    id?: string;
    /**      */
    createdDate?: number;
    /**      */
    modifiedDate?: number;
    /**      ID */
    nameId?: string;
    /**    Enum (GOLD:GOLD,WSP:VTOKEN,PHONE CHARGE TICKET:PHONE_CHARGE_TICKET,FLOW CARD:FLOW_CARD,HIGGS CARD CHANCE:HIGGS_CARD_CHANCE,HIGGS EXCHANGE TICKET:HIGGS_EXCHANGE_TICKET,BLUETOOTH EARPHONE:BLUETOOTH_EARPHONE,POWER BANK:POWER_BANK,3 IN 1 CHARGING CABLE:THREE_IN_ONE_CHARGING_CABLE) */
    type?:
      | 'GOLD'
      | 'VTOKEN'
      | 'PHONE_CHARGE_TICKET'
      | 'FLOW_CARD'
      | 'HIGGS_CARD_CHANCE'
      | 'HIGGS_EXCHANGE_TICKET'
      | 'BLUETOOTH_EARPHONE'
      | 'POWER_BANK'
      | 'THREE_IN_ONE_CHARGING_CABLE';
    /**    */
    num?: BigDecimalString;
    /**       Enum (    :DURATION_DAYS,    :DATE_RANGE_DAYS,    :PERMANENT) */
    validType?: 'DURATION_DAYS' | 'DATE_RANGE_DAYS' | 'PERMANENT';
    /**     */
    validPeriod?: string;
    /**      Enum (GOLD:GOLD,WSP:VTOKEN,Bonus GOLD:BONUS_GOLD) */
    priceType?: 'GOLD' | 'VTOKEN' | 'BONUS_GOLD';
    /**     */
    priceValue?: BigDecimalString;
    /**        */
    maxStackNum?: number;
    /**        ID */
    descriptionId?: string;
    /**       */
    backpack?: boolean;
    /**        */
    autoUse?: boolean;
    /**       */
    usable?: boolean;
    /**   ID，  image_manage  */
    imageId?: string;
    /**        */
    nameText?: string;
    /**        */
    descriptionText?: string;
    /**     url PropertyConverter(UploadKeyConverterEditor) */
    imageUrl?: string;
  };

  type PropRewardDetailVO = {
    /**   Id */
    id?: string;
    /**     id */
    propId?: string;
    /**        */
    propNum?: number;
    /** random config table   (JSON_ARRAY) */
    ranges?: RandomConfigItemAO[];
    /**          */
    minPropNum?: number;
    /**          */
    maxPropNum?: number;
    /**        */
    nameText?: string;
    /**       url PropertyConverter(UploadKeyConverterEditor) */
    imageUrl?: string;
    /**    Enum (GOLD:GOLD,WSP:VTOKEN,PHONE CHARGE TICKET:PHONE_CHARGE_TICKET,FLOW CARD:FLOW_CARD,HIGGS CARD CHANCE:HIGGS_CARD_CHANCE,HIGGS EXCHANGE TICKET:HIGGS_EXCHANGE_TICKET,BLUETOOTH EARPHONE:BLUETOOTH_EARPHONE,POWER BANK:POWER_BANK,3 IN 1 CHARGING CABLE:THREE_IN_ONE_CHARGING_CABLE) */
    type?:
      | 'GOLD'
      | 'VTOKEN'
      | 'PHONE_CHARGE_TICKET'
      | 'FLOW_CARD'
      | 'HIGGS_CARD_CHANCE'
      | 'HIGGS_EXCHANGE_TICKET'
      | 'BLUETOOTH_EARPHONE'
      | 'POWER_BANK'
      | 'THREE_IN_ONE_CHARGING_CABLE';
    /**    */
    num?: BigDecimalString;
    /**        */
    autoUse?: boolean;
    /**       */
    usable?: boolean;
    /**     Id */
    propBagId?: string;
  };

  type RandomConfigItemAO = {
    /** min value */
    minNum: number;
    /** max value */
    maxNum: number;
    /** random value */
    probability: number;
  };

  type RedeemCodeActivateAO = {
    /** redeem code    ''    */
    redeemSymbol: string;
  };

  type RedeemCodeActivateVO = {
    /**      Enum (GOLD:GOLD,WSP:VTOKEN,Bonus GOLD:BONUS_GOLD) */
    rewardType?: 'GOLD' | 'VTOKEN' | 'BONUS_GOLD';
    /**      */
    rewardAmount?: BigDecimalString;
  };

  type ReportJockPointAO = {
    /** gameId */
    gameId: string;
    alarmData: AlarmData;
  };

  type rewardRechargeGetPayGiftControllerParams = {
    /** activity type,Enum (First Recharge:FIRST_CHARGE,Check in:SIGN_IN,Lucky Wheel:TURNTABLE,Higgs:HIGGS,7 Days Event:SEVEN_DAY_ACTIVITIES,Ranking:RANKING_LIST,PAY:PAY,TASK:GAME_HALL_TASK,BankruptCY:BANKRUPTCY_ACTIVITY,special recharge:SPECIAL_RECHARGE,Tomorrow gift:TOMORROW_GIFT,fission task:FISSION_TASK,novice 5 days tasks:NOVICE_FIVE_DAYS,week recharge:WEEK_RECHARGE,growth plan:GROWTH_PLAN,recovery recharge gift:RECOVERY_RECHARGE,welfare entry:WELFARE_ENTRY,Game Invite:GAME_INVITE,topup entry:TOPUP_ENTRY,recovery smash egg:RECOVERY_SMASH_EGG,pay activities entry:PAY_ENTRY,benefit:BENEFIT) */
    activityType?:
      | 'FIRST_CHARGE'
      | 'SIGN_IN'
      | 'TURNTABLE'
      | 'HIGGS'
      | 'SEVEN_DAY_ACTIVITIES'
      | 'RANKING_LIST'
      | 'PAY'
      | 'GAME_HALL_TASK'
      | 'BANKRUPTCY_ACTIVITY'
      | 'SPECIAL_RECHARGE'
      | 'TOMORROW_GIFT'
      | 'FISSION_TASK'
      | 'NOVICE_FIVE_DAYS'
      | 'WEEK_RECHARGE'
      | 'GROWTH_PLAN'
      | 'RECOVERY_RECHARGE'
      | 'WELFARE_ENTRY'
      | 'GAME_INVITE'
      | 'TOPUP_ENTRY'
      | 'RECOVERY_SMASH_EGG'
      | 'PAY_ENTRY'
      | 'BENEFIT';
  };

  type RollMessageCacheAO = {
    /**              */
    rollSceneType?: ('HALL' | 'ALL_GAME' | 'SPECIFIED_GAMES')[];
    /**      Id */
    gameIds?: string[];
  };

  type RunningGameVO = {
    /** gameId */
    gameId?: string;
    /**    */
    content?: string;
    /**            (    ) */
    mostGold?: BigDecimalString;
    /**            （              ） */
    amount?: BigDecimalString;
    /**          */
    isReconnectSupported?: boolean;
    /**      Enum (HORIZONTAL:HORIZONTAL,VERTICAL:VERTICAL) */
    orientation?: 'HORIZONTAL' | 'VERTICAL';
  };

  type SettlementPageAO = {
    /**     (  :1) */
    pageIndex?: number;
    /**     (  :8) */
    pageSize?: number;
    /**   ID */
    gameId?: string;
    /**      */
    startTime?: number;
    /**      */
    endTime?: number;
    /**      Enum (    :NORMAL,  :FORCE_QUIT,    :TIMEOUT,    :DISMISSED_BY_ADMIN) */
    exitType?: 'NORMAL' | 'FORCE_QUIT' | 'TIMEOUT' | 'DISMISSED_BY_ADMIN';
    /**   ID */
    userId?: string;
  };

  type SmashEggActivityVO = {
    /** activity start time */
    validStartTime?: number;
    /** activity end time */
    validEndTime?: number;
    /** one reward amount */
    oneRewardAmount?: BigDecimalString;
    /** reward count */
    rewardCount?: number;
    /** recharge amount */
    rechargeAmount?: BigDecimalString;
    /** reward phase amount */
    rewardPhaseAmount?: BigDecimalString;
    /** reward prop items */
    items?: PropBagItemUserVO[];
  };

  type SmsMobileSendAO = {
    /**           */
    mobile: string;
    /**     */
    countryCode?: number;
    /**     */
    captcha: string;
  };

  type TaskClaimRewardAO = {
    /**   id */
    taskId?: string;
    /**      Enum (novice guide:NOVICE_GUIDE,task center:TASK_CENTER,Fission:FISSION,higgs:HIGGS,withdraw:WITHDRAW,seven day activity:SEVEN_DAY_ACTIVITY,Fission invite:FISSION_INVITE,invite:INVITE,recharge activity:RECHARGE,v-game novice tasks:VGAME_NOVICE,v-game tomorrow gift task:VGAME_TOMORROW_GIFT,v-game welcome task:VGAME_WELCOME,v-game novice 5 days tasks:VGAME_NOVICE_FIVE_DAYS,growth plan tasks:GROWTH_PLAN) */
    moduleType?:
      | 'NOVICE_GUIDE'
      | 'TASK_CENTER'
      | 'FISSION'
      | 'HIGGS'
      | 'WITHDRAW'
      | 'SEVEN_DAY_ACTIVITY'
      | 'FISSION_INVITE'
      | 'INVITE'
      | 'RECHARGE'
      | 'VGAME_NOVICE'
      | 'VGAME_TOMORROW_GIFT'
      | 'VGAME_WELCOME'
      | 'VGAME_NOVICE_FIVE_DAYS'
      | 'GROWTH_PLAN';
    /**      Enum (daily task:DAILY,novice task:NOVICE,novice guide task:NOVICE_GUIDE,day task:DAY,activity share task:ACTIVITY_SHARE,continuity task:CONTINUITY,small withdraw task:SMALL_WITHDRAW,limit time:LIMIT_TIME,Fission invite:FISSION_INVITE,vgame novice:VGAME_NOVICE,vgame tomorrow gift:VGAME_TOMORROW_GIFT,vgame welcome:VGAME_WELCOME,vgame novice 1 day:VGAME_NOVICE_FIRST_DAY,vgame novice 2 day:VGAME_NOVICE_SECOND_DAY,vgame novice 3 day:VGAME_NOVICE_THIRD_DAY,vgame novice 4 day:VGAME_NOVICE_FOURTH_DAY,vgame novice 5 day:VGAME_NOVICE_FIFTH_DAY,growth plan tasks:GROWTH_PLAN) */
    groupType?:
      | 'DAILY'
      | 'NOVICE'
      | 'NOVICE_GUIDE'
      | 'DAY'
      | 'ACTIVITY_SHARE'
      | 'CONTINUITY'
      | 'SMALL_WITHDRAW'
      | 'LIMIT_TIME'
      | 'FISSION_INVITE'
      | 'VGAME_NOVICE'
      | 'VGAME_TOMORROW_GIFT'
      | 'VGAME_WELCOME'
      | 'VGAME_NOVICE_FIRST_DAY'
      | 'VGAME_NOVICE_SECOND_DAY'
      | 'VGAME_NOVICE_THIRD_DAY'
      | 'VGAME_NOVICE_FOURTH_DAY'
      | 'VGAME_NOVICE_FIFTH_DAY'
      | 'GROWTH_PLAN';
  };

  type TaskGroupQueryAO = {
    /**      Enum (novice guide:NOVICE_GUIDE,task center:TASK_CENTER,Fission:FISSION,higgs:HIGGS,withdraw:WITHDRAW,seven day activity:SEVEN_DAY_ACTIVITY,Fission invite:FISSION_INVITE,invite:INVITE,recharge activity:RECHARGE,v-game novice tasks:VGAME_NOVICE,v-game tomorrow gift task:VGAME_TOMORROW_GIFT,v-game welcome task:VGAME_WELCOME,v-game novice 5 days tasks:VGAME_NOVICE_FIVE_DAYS,growth plan tasks:GROWTH_PLAN) */
    moduleType:
      | 'NOVICE_GUIDE'
      | 'TASK_CENTER'
      | 'FISSION'
      | 'HIGGS'
      | 'WITHDRAW'
      | 'SEVEN_DAY_ACTIVITY'
      | 'FISSION_INVITE'
      | 'INVITE'
      | 'RECHARGE'
      | 'VGAME_NOVICE'
      | 'VGAME_TOMORROW_GIFT'
      | 'VGAME_WELCOME'
      | 'VGAME_NOVICE_FIVE_DAYS'
      | 'GROWTH_PLAN';
    /**      Enum (daily task:DAILY,novice task:NOVICE,novice guide task:NOVICE_GUIDE,day task:DAY,activity share task:ACTIVITY_SHARE,continuity task:CONTINUITY,small withdraw task:SMALL_WITHDRAW,limit time:LIMIT_TIME,Fission invite:FISSION_INVITE,vgame novice:VGAME_NOVICE,vgame tomorrow gift:VGAME_TOMORROW_GIFT,vgame welcome:VGAME_WELCOME,vgame novice 1 day:VGAME_NOVICE_FIRST_DAY,vgame novice 2 day:VGAME_NOVICE_SECOND_DAY,vgame novice 3 day:VGAME_NOVICE_THIRD_DAY,vgame novice 4 day:VGAME_NOVICE_FOURTH_DAY,vgame novice 5 day:VGAME_NOVICE_FIFTH_DAY,growth plan tasks:GROWTH_PLAN) */
    groupType:
      | 'DAILY'
      | 'NOVICE'
      | 'NOVICE_GUIDE'
      | 'DAY'
      | 'ACTIVITY_SHARE'
      | 'CONTINUITY'
      | 'SMALL_WITHDRAW'
      | 'LIMIT_TIME'
      | 'FISSION_INVITE'
      | 'VGAME_NOVICE'
      | 'VGAME_TOMORROW_GIFT'
      | 'VGAME_WELCOME'
      | 'VGAME_NOVICE_FIRST_DAY'
      | 'VGAME_NOVICE_SECOND_DAY'
      | 'VGAME_NOVICE_THIRD_DAY'
      | 'VGAME_NOVICE_FOURTH_DAY'
      | 'VGAME_NOVICE_FIFTH_DAY'
      | 'GROWTH_PLAN';
  };

  type TaskGroupStatusVO = {
    /**     Enum (daily task:DAILY,novice task:NOVICE,novice guide task:NOVICE_GUIDE,day task:DAY,activity share task:ACTIVITY_SHARE,continuity task:CONTINUITY,small withdraw task:SMALL_WITHDRAW,limit time:LIMIT_TIME,Fission invite:FISSION_INVITE,vgame novice:VGAME_NOVICE,vgame tomorrow gift:VGAME_TOMORROW_GIFT,vgame welcome:VGAME_WELCOME,vgame novice 1 day:VGAME_NOVICE_FIRST_DAY,vgame novice 2 day:VGAME_NOVICE_SECOND_DAY,vgame novice 3 day:VGAME_NOVICE_THIRD_DAY,vgame novice 4 day:VGAME_NOVICE_FOURTH_DAY,vgame novice 5 day:VGAME_NOVICE_FIFTH_DAY,growth plan tasks:GROWTH_PLAN) */
    group?:
      | 'DAILY'
      | 'NOVICE'
      | 'NOVICE_GUIDE'
      | 'DAY'
      | 'ACTIVITY_SHARE'
      | 'CONTINUITY'
      | 'SMALL_WITHDRAW'
      | 'LIMIT_TIME'
      | 'FISSION_INVITE'
      | 'VGAME_NOVICE'
      | 'VGAME_TOMORROW_GIFT'
      | 'VGAME_WELCOME'
      | 'VGAME_NOVICE_FIRST_DAY'
      | 'VGAME_NOVICE_SECOND_DAY'
      | 'VGAME_NOVICE_THIRD_DAY'
      | 'VGAME_NOVICE_FOURTH_DAY'
      | 'VGAME_NOVICE_FIFTH_DAY'
      | 'GROWTH_PLAN';
    /**      */
    tasks?: TaskItemVO[];
    /**         :13     */
    startTime?: string;
    /**         :13    (-1:  ) */
    endTime?: string;
  };

  type TaskItemVO = {
    /**   id */
    taskId?: string;
    /**   id */
    nameId?: string;
    /**    */
    name?: string;
    /**   id */
    iconId?: string;
    /**    PropertyConverter(UploadKeyConverterEditor) */
    icon?: string;
    /**        */
    propRewards?: PropRewardDetailVO[];
    /**     */
    currentValue?: BigDecimalString;
    /**     */
    targetValue?: BigDecimalString;
    /**        Enum (      s:second,      :count) */
    targetValueUnit?: 'second' | 'count';
    /**   id */
    descriptionId?: string;
    /**    */
    description?: string;
    /**         :13                */
    startTime?: string;
    /**         :13    (-1:  ) */
    endTime?: string;
    /**      Enum (   :FINISHED,   :AVAILABLE,   :UNDERWAY,   :NOT_STARTED,   :TIMEOUT,     :NOT_TAKEN) */
    status?:
      | 'FINISHED'
      | 'AVAILABLE'
      | 'UNDERWAY'
      | 'NOT_STARTED'
      | 'TIMEOUT'
      | 'NOT_TAKEN';
    /**      */
    level?: number;
    /**      Enum (INVITE:INVITE,RECHARGE:RECHARGE,BET:BET,WATCH:WATCH,NAVIGATION:NAVIGATION,LOGIN:LOGIN,PLAY:PLAY,ACTIVITY:ACTIVITY,WIN:WIN) */
    behaviorType?:
      | 'INVITE'
      | 'RECHARGE'
      | 'BET'
      | 'WATCH'
      | 'NAVIGATION'
      | 'LOGIN'
      | 'PLAY'
      | 'ACTIVITY'
      | 'WIN';
    /**      */
    url?: string;
    /**      Enum (OUTER LINK:OUTER_LINK,APP LINK:APP_LINK) */
    opType?: 'OUTER_LINK' | 'APP_LINK';
    /**        */
    autoReport?: boolean;
    /**          */
    autoReward?: boolean;
  };

  type TaskProgressReportAO = {
    /**       (JSON_ARRAY) */
    items: TaskProgressReportItemAO[];
  };

  type TaskProgressReportItemAO = {
    /**    Enum (INVITE:INVITE,RECHARGE:RECHARGE,BET:BET,WATCH:WATCH,NAVIGATION:NAVIGATION,LOGIN:LOGIN,PLAY:PLAY,ACTIVITY:ACTIVITY,WIN:WIN) */
    behavior:
      | 'INVITE'
      | 'RECHARGE'
      | 'BET'
      | 'WATCH'
      | 'NAVIGATION'
      | 'LOGIN'
      | 'PLAY'
      | 'ACTIVITY'
      | 'WIN';
    /**    Enum (INVITE USER:INVITE_USER,INVITE RECHARGE USER:INVITE_RECHARGE_USER,INVITE RECHARGE SUM:INVITE_RECHARGE_SUM,INVITE SPEND SUM:INVITE_SPEND_SUM,RECHARGE ALL CHANNELS:RECHARGE_ALL_CHANNELS,PLAY GAME ALL:PLAY_GAME_ALL,PLAY GAME PP:PLAY_GAME_PP,WATCH VIDEO SHORT VIDEO:WATCH_VIDEO_SHORT_VIDEO,WATCH VIDEO MIDDLE VIDEO:WATCH_VIDEO_MIDDLE_VIDEO,WATCH VIDEO LONG VIDEO:WATCH_VIDEO_LONG_VIDEO,WATCH VIDEO GUIDE:WATCH_VIDEO_GUIDE,WATCH VIDEO ALL:WATCH_VIDEO_ALL,ACTIVITY SIGN IN:ACTIVITY_SIGN_IN,ACTIVITY LUCKY WHEEL DIAMOND:ACTIVITY_LUCKY_WHEEL_DIAMOND,NAVIGATION CUSTOMIZED:NAVIGATION_CUSTOMIZED) */
    subject:
      | 'INVITE_USER'
      | 'INVITE_RECHARGE_USER'
      | 'INVITE_RECHARGE_SUM'
      | 'INVITE_SPEND_SUM'
      | 'RECHARGE_ALL_CHANNELS'
      | 'PLAY_GAME_ALL'
      | 'PLAY_GAME_PP'
      | 'WATCH_VIDEO_SHORT_VIDEO'
      | 'WATCH_VIDEO_MIDDLE_VIDEO'
      | 'WATCH_VIDEO_LONG_VIDEO'
      | 'WATCH_VIDEO_GUIDE'
      | 'WATCH_VIDEO_ALL'
      | 'ACTIVITY_SIGN_IN'
      | 'ACTIVITY_LUCKY_WHEEL_DIAMOND'
      | 'NAVIGATION_CUSTOMIZED';
    /**    Enum (BOOLEAN:BOOLEAN,COUNT:COUNT,TIMES:TIMES,GOLD:GOLD,SECOND:SECOND,LIGHT COMPLETE:LIGHT_COMPLETE,MIDDLE COMPLETE:MIDDLE_COMPLETE,HEAVY COMPLETE:HEAVY_COMPLETE,PLAY TIMES:PLAY_TIMES,PLAY GAME COUNT:PLAY_GAME_COUNT) */
    unit:
      | 'BOOLEAN'
      | 'COUNT'
      | 'TIMES'
      | 'GOLD'
      | 'SECOND'
      | 'LIGHT_COMPLETE'
      | 'MIDDLE_COMPLETE'
      | 'HEAVY_COMPLETE'
      | 'PLAY_TIMES'
      | 'PLAY_GAME_COUNT';
    /**        */
    value: BigDecimalStringAO;
    /**          */
    assistDataList?: string[];
  };

  type TaskReportDataV2AO = {
    /**        Enum (      (  ： ):VIDEO,     (  ： ):GAME) */
    taskProgressType: 'VIDEO' | 'GAME';
    /**      */
    num: BigDecimalStringAO;
  };

  type TaskReportResultVO = {
    /**   Id */
    id?: string;
    /**      */
    createdDate?: number;
    /**      */
    modifiedDate?: number;
    /**           */
    taskDict?: number;
    /**            */
    taskName?: string;
    /**       */
    progress?: BigDecimalString;
    /**      */
    reward?: BigDecimalString;
    /** token    */
    tokenReward?: BigDecimalString;
  };

  type TaskRewardGameCoinAO = {
    /**   id */
    taskId: string;
    /**   id */
    gameId: string;
  };

  type TaskRewardVO = {
    /**        id */
    taskId?: string;
    /**            */
    nameId?: string;
    /**            */
    name?: string;
    /**       */
    progress?: BigDecimalString;
    /**      */
    level?: number;
    /**      */
    rewards?: PropRewardDetailVO[];
    /**         */
    receivedRewards?: boolean;
    /**        Enum (DAILY:DAILY,SINGLE:SINGLE,TAKE:TAKE) */
    logicType?: 'DAILY' | 'SINGLE' | 'TAKE';
    /**        Enum (   :NULL_TAG,      :NEW_HAND) */
    tag?: 'NULL_TAG' | 'NEW_HAND';
    /**       id */
    id?: string;
    /**        id */
    taskGroupRewardId?: string;
  };

  type TaskSeriesVO = {
    /**   Id */
    id?: string;
    /**      */
    createdDate?: number;
    /**      */
    modifiedDate?: number;
    /**      Enum (DAILY:DAILY,NEWHAND:NEWHAND) */
    taskType?: 'DAILY' | 'NEWHAND';
    /**      */
    tasks?: TaskVO[];
    /**      */
    expirationTime?: string;
  };

  type TaskSimpleProgressReportAO = {
    /**   id */
    taskId: string;
  };

  type TaskVO = {
    /**   Id */
    id?: string;
    /**      */
    createdDate?: number;
    /**      */
    modifiedDate?: number;
    /**      */
    taskDict?: number;
    /**    */
    name?: string;
    /**    */
    icon?: string;
    /**   (  ) */
    reward?: BigDecimalString;
    /**   (token) */
    tokenReward?: BigDecimalString;
    /**     */
    currentValue?: BigDecimalString;
    /**     */
    targetValue?: BigDecimalString;
    /**         Enum (      s:second,      :count) */
    targetValueUnit?: 'second' | 'count';
    /**    */
    remark?: string;
    /**         :13    (-1:  ) */
    endTime?: string;
    /**      Enum (   :FINISHED,   :AVAILABLE,   :UNDERWAY,   :NOT_STARTED,   :TIMEOUT,     :NOT_TAKEN) */
    status?:
      | 'FINISHED'
      | 'AVAILABLE'
      | 'UNDERWAY'
      | 'NOT_STARTED'
      | 'TIMEOUT'
      | 'NOT_TAKEN';
    /**      */
    level?: number;
    /**            */
    supplement?: string;
  };

  type TransactionPageAO = {
    /**     (  :1) */
    pageIndex?: number;
    /**     (  :8) */
    pageSize?: number;
    /** transactionId */
    id?: string;
    /**   Id */
    userId?: string;
    /**    Enum ( :ADD, :SUB) */
    direct?: 'ADD' | 'SUB';
    /**    Enum (  :PENDING,  :SUCCESS,  :FAIL) */
    transactionStatus?: 'PENDING' | 'SUCCESS' | 'FAIL';
    /**      [    ](/static/doc/data_dictionary.html)   :{'k':'  ','v':' '} */
    transactionType?: string;
  };

  type TransactionVO = {
    /**   Id */
    id?: string;
    /**      */
    createdDate?: number;
    /**      */
    modifiedDate?: number;
    /**   ID */
    userId?: string;
    /**     Enum (GOLD:GOLD,WSP:VTOKEN,Bonus GOLD:BONUS_GOLD) */
    coin?: 'GOLD' | 'VTOKEN' | 'BONUS_GOLD';
    /**    */
    amount?: BigDecimalString;
    /**    Enum ( :ADD, :SUB) */
    direct?: 'ADD' | 'SUB';
    /**    Enum (  :PENDING,  :SUCCESS,  :FAIL) */
    transactionStatus?: 'PENDING' | 'SUCCESS' | 'FAIL';
    transactionType?:
      | 'RECHARGE'
      | 'WITHDRAWAL'
      | 'GAME_DISTRIBUTION'
      | 'GAME_EXCHANGE_GAMECOIN'
      | 'GAME_EXCHANGE_GOLDCOIN'
      | 'VTOKEN_ECCHANGE_GOLD'
      | 'ACTIVITY'
      | 'TASK'
      | 'PLAY_GAME'
      | 'TEAM_RECHARGE_REWARDS'
      | 'ADMIN_CHANGE'
      | 'REDEEM_CODE'
      | 'MESSAGE_REWARD'
      | 'CHECKIN'
      | 'LUCKY_WHEEL'
      | 'LUCKY_WHEEL_GOLD'
      | 'LUCKY_WHEEL_DIAMOND'
      | 'PROP'
      | 'HIGGS'
      | 'SPECIAL_RECHARGE'
      | 'EXPIRE_CLEAR';
    /**    */
    remark?: string;
    /**         */
    selfAmount?: BigDecimalString;
    /**           */
    selfFreezeAmount?: BigDecimalString;
  };

  type TurnTableItemVO = {
    /**   Id */
    id?: string;
    /**      */
    createdDate?: number;
    /**      */
    modifiedDate?: number;
    /**      */
    idx?: number;
    /**    */
    icon?: string;
    /**      Enum (COIN:COIN,TRY AGAIN:TRY_AGAIN,NOTHING:NOTHING) */
    rewardType?: 'COIN' | 'TRY_AGAIN' | 'NOTHING';
    /**    Enum (GOLD:GOLD,WSP:VTOKEN,Bonus GOLD:BONUS_GOLD) */
    coin?: 'GOLD' | 'VTOKEN' | 'BONUS_GOLD';
    /**       */
    coinValue?: BigDecimalString;
    /**       */
    odds?: number;
  };

  type TurnTableVO = {
    /**   Id */
    id?: string;
    /**      */
    createdDate?: number;
    /**      */
    modifiedDate?: number;
    /**      Enum (UNREACHED:UNREACHED,UNDONE:UNDONE,DONE:DONE) */
    status?: 'UNREACHED' | 'UNDONE' | 'DONE';
    /**         */
    undoneTasks?: number;
    /**      */
    firstTime?: boolean;
    /**      */
    items?: TurnTableItemVO[];
  };

  type UpdateUserSelfNicknameAO = {
    /**      */
    nickName: string;
  };

  type UploadConfigAO = {
    /** contentType */
    contentType?: string;
    /** extension */
    extension?: string;
  };

  type UploadConfigVO = {
    /** put url */
    putUrl?: string;
    /** file url */
    fileUrl?: string;
  };

  type UserAccountVO = {
    /**   Id */
    id?: string;
    /**      */
    createdDate?: number;
    /**      */
    modifiedDate?: number;
    userInfo?: VnUserInfoVO;
    /**          */
    bindMobile?: boolean;
    /**        */
    playedTurnTable?: boolean;
    /**       */
    firstRecharged?: boolean;
    /**      */
    gameLevel?: number;
    /**             （  ,-1  ） */
    freezeDuration?: string;
    /**           （true    ） */
    freeze?: boolean;
    /**        */
    customerEmail?: string;
    /**             （UTC     ） */
    dailyTaskEndHour?: number;
    /**            */
    hasInviter?: boolean;
    userFissionUserInfo?: UserFissionUserInfoVO;
    /**         */
    withdrawal?: boolean;
    /** user recharge count */
    rechargeCount?: number;
    /** Have users played games before */
    userHavePlayedGame?: boolean;
  };

  type UserActivitiesManagementListAO = {
    /**              */
    showInList?: boolean;
    /**      */
    types?: (
      | 'FIRST_CHARGE'
      | 'SIGN_IN'
      | 'TURNTABLE'
      | 'HIGGS'
      | 'SEVEN_DAY_ACTIVITIES'
      | 'RANKING_LIST'
      | 'PAY'
      | 'GAME_HALL_TASK'
      | 'BANKRUPTCY_ACTIVITY'
      | 'SPECIAL_RECHARGE'
      | 'TOMORROW_GIFT'
      | 'FISSION_TASK'
      | 'NOVICE_FIVE_DAYS'
      | 'WEEK_RECHARGE'
      | 'GROWTH_PLAN'
      | 'RECOVERY_RECHARGE'
      | 'WELFARE_ENTRY'
      | 'GAME_INVITE'
      | 'TOPUP_ENTRY'
      | 'RECOVERY_SMASH_EGG'
      | 'PAY_ENTRY'
      | 'BENEFIT'
    )[];
  };

  type UserBalanceInfoVO = {
    /** user balance info（vtoken / cash gold /bonus gold） */
    userCoinItems?: UserBalanceItemVO[];
  };

  type UserBalanceItemVO = {
    /**   Id */
    id?: string;
    /**      */
    createdDate?: number;
    /**      */
    modifiedDate?: number;
    /**     Enum (GOLD:GOLD,WSP:VTOKEN,Bonus GOLD:BONUS_GOLD) */
    coin?: 'GOLD' | 'VTOKEN' | 'BONUS_GOLD';
    /**   (           ) */
    amount?: BigDecimalString;
    /**      */
    freezeAmount?: BigDecimalString;
    /** vtoken  Rp(1dst=rp) */
    tokenPriceRp?: BigDecimalString;
    /** vtoken   (1dst=usdt) */
    tokenPrice?: BigDecimalString;
    /** token     [-0.025 , 0.025] */
    tokenPriceIncrease?: BigDecimalString;
  };

  type UserBindMobileAO = {
    /**           */
    mobile: string;
    /**     */
    countryCode: number;
    /**          */
    verifyCode: string;
  };

  type UserBindMobileV2AO = {
    /**           */
    mobile: string;
    /**     */
    countryCode: number;
  };

  type UserBusinessInfoVO = {
    /**             */
    canClaimNoviceWelcome?: boolean;
  };

  type UserCenterVO = {
    /** gold total balance(cash+bonus+game) */
    goldTotalAmount?: BigDecimalString;
    /** enable withdrawal gold amount */
    enableWithdrawalGoldTotalAmount?: BigDecimalString;
    /** WSP amount */
    wspTotalAmount?: BigDecimalString;
    /** cash gold amount */
    cashGoldTotalAmount?: BigDecimalString;
    /** bonus gold amount */
    bonusGoldTotalAmount?: BigDecimalString;
    /** today bonus gold amount */
    todayBonusTotalAmount?: BigDecimalString;
    /** Accumulated increase bonus amount */
    accumulatedIncreaseBonusAmount?: BigDecimalString;
  };

  type UserCoinAssetsVO = {
    /**   Id */
    id?: string;
    /**      */
    createdDate?: number;
    /**      */
    modifiedDate?: number;
    /**     Enum (GOLD:GOLD,WSP:VTOKEN,Bonus GOLD:BONUS_GOLD) */
    coin?: 'GOLD' | 'VTOKEN' | 'BONUS_GOLD';
    /**   (           ) */
    amount?: BigDecimalString;
    /**      */
    freezeAmount?: BigDecimalString;
  };

  type UserExpLevelRuleVO = {
    /**    Enum (General User:zero,Game Rising Star:one,Game Ambassador:two,Game Agent:three,Game partner:four) */
    level?: 'zero' | 'one' | 'two' | 'three' | 'four';
    /**     */
    levelNo?: number;
    /**        dst        */
    feeRatio?: BigDecimalString;
  };

  type UserFissionAssetStatVO = {
    /** The amount of unclaimed coins */
    unclaimedGoldAmount?: BigDecimalString;
    /** The user's gold assets */
    userGoldAmount?: BigDecimalString;
    /** The user's cash gold assets */
    cashGoldAmount?: BigDecimalString;
    /** The user's bonus gold assets */
    bonusGoldAmount?: BigDecimalString;
    /** has small Withdraw */
    hasSmallWithdraw?: boolean;
    /** small Withdraw amount limit */
    smallWithdrawAmountLimit?: BigDecimalString;
    /** Prompt copywriting */
    alertContent?: string;
  };

  type UserFissionCheckInActivityVO = {
    /**            */
    items?: FissionSevenDaysTaskConfigVO[];
    /**              */
    signIn?: boolean;
    /**         */
    currentDays?: number;
  };

  type UserFissionTaskVO = {
    /**         */
    novice?: boolean;
    /**      */
    tasks?: TaskItemVO[];
  };

  type UserFissionTeamMemberPageAO = {
    /**     (  :1) */
    pageIndex?: number;
    /**     (  :8) */
    pageSize?: number;
    /**   ID */
    userId?: string;
  };

  type UserFissionTeamMemberPageVO = {
    /**   Id */
    userId?: string;
    /**    */
    nickName?: string;
    /**    */
    timeZone?: string;
    /**    */
    avatar?: string;
    /**    */
    email?: string;
    /**      */
    createTime?: number;
    /**       */
    loginDays?: number;
    /**               */
    taskTotalReward?: BigDecimalString;
    /**           Enum (   :UNCOMPLETED,   :COMPLETED,  :EXPIRED) */
    userTaskStatus?: 'UNCOMPLETED' | 'COMPLETED' | 'EXPIRED';
  };

  type UserFissionTeamStatVO = {
    /**       */
    teamCount?: number;
    /**               */
    taskTotalReward?: BigDecimalString;
    /**             */
    unCliamedTotalReward?: BigDecimalString;
  };

  type UserFissionUserInfoVO = {
    /**          Enum (ABSOLUTELY CONVERTIBLE:ABSOLUTELY_CONVERTIBLE,MAYBE CONVERTIBLE:MAYBE_CONVERTIBLE,ABSOLUTELY NO CONVERTIBLE:ABSOLUTELY_NO_CONVERTIBLE) */
    userFissionLevel?:
      | 'ABSOLUTELY_CONVERTIBLE'
      | 'MAYBE_CONVERTIBLE'
      | 'ABSOLUTELY_NO_CONVERTIBLE';
    /**            */
    completedNoviceGuideTask?: boolean;
    /**            */
    noviceTaskTotalReward?: BigDecimalString;
    /**        */
    extractableReward?: BigDecimalString;
    /**       id */
    noviceGuideTaskId?: string;
  };

  type UserGameInviteRewardListVO = {
    /**          */
    nickName?: string;
    /**    url */
    avatar?: string;
    /**     */
    goldAmount?: BigDecimalString;
  };

  type UserGameInviteStatVO = {
    /**          Enum (General User:zero,Game Rising Star:one,Game Ambassador:two,Game Agent:three,Game partner:four) */
    gameLevel?: 'zero' | 'one' | 'two' | 'three' | 'four';
    /**          Enum (General User:zero,Game Rising Star:one,Game Ambassador:two,Game Agent:three,Game partner:four) */
    gameNextLevel?: 'zero' | 'one' | 'two' | 'three' | 'four';
    /**               */
    nextLevelDiff?: number;
    /**     dst     */
    totalDstAmount?: BigDecimalString;
    /**            */
    totalGoldAmount?: BigDecimalString;
    /** WSP to rp */
    dstToRpTotalAmount?: BigDecimalString;
    /** gold to rp */
    goldToRpTotalAmount?: BigDecimalString;
    /**     （WSP+gold to rp） */
    totalRpAmount?: BigDecimalString;
    /**        */
    inviteNum?: number;
    /**        */
    directInviteNum?: number;
  };

  type UserGameRoundInfoVO = {
    /** number of game round */
    gameRoundCount?: number;
    /** openId */
    openId?: string;
  };

  type UserIdAO = {
    /**   ID */
    userId: string;
  };

  type UserInviteCreateAO = {
    /**       :0-     ;1-  ;2-   */
    type: number;
    /**        ''    */
    inviteKey: string;
  };

  type UserInviteModifyRemarkAO = {
    /**        Enum (ALL:ALL,GAME:GAME,ASSET:ASSET) */
    type: 'ALL' | 'GAME' | 'ASSET';
    /**       id */
    inviteeId: string;
    /**      */
    remark: string;
  };

  type UserMessageCollectRewardAO = {
    /**    id */
    messageIds?: string[];
  };

  type UserMessageCollectRewardVO = {
    /**      Enum (GOLD:GOLD,WSP:VTOKEN) */
    rewardType?: 'GOLD' | 'VTOKEN';
    /**      */
    amount?: BigDecimalString;
  };

  type UserMessageHasReadVO = {
    /**         (true- ) */
    hasRead?: boolean;
    /**             (true- ) */
    hasReward?: boolean;
  };

  type UserMessageMarkReadAO = {
    /**    id   */
    messageIds?: string[];
  };

  type UserMessagePageAO = {
    /**     (  :1) */
    pageIndex?: number;
    /**     (  :8) */
    pageSize?: number;
    /**      */
    readStatus?: boolean;
  };

  type UserMessageVO = {
    /**   Id */
    id?: string;
    /**      */
    createdDate?: number;
    /**      */
    modifiedDate?: number;
    /**    */
    title?: string;
    /**    */
    content?: string;
    /**         （true- ） */
    hasReward?: boolean;
    /**      */
    rewards?: MessageRewardItemVO[];
    /**      */
    pushDateTime?: number;
    /**        true- ） */
    readStatus?: boolean;
  };

  type UserPlayGameStatVO = {
    /**       dst   WSP amount */
    dstTotalAmount?: BigDecimalString;
    /**       dst to rp */
    dstToRpTotalAmount?: BigDecimalString;
    /**      DST    (true- ) */
    hasDstRecord?: boolean;
  };

  type UserPropPageAO = {
    /**     (  :1) */
    pageIndex?: number;
    /**     (  :8) */
    pageSize?: number;
    /** userId */
    userId?: string;
    /**        ，   null，       */
    usable?: boolean;
    /**          ，   null，       */
    backpack?: boolean;
    /**      Enum (GOLD:GOLD,WSP:VTOKEN,PHONE CHARGE TICKET:PHONE_CHARGE_TICKET,FLOW CARD:FLOW_CARD,HIGGS CARD CHANCE:HIGGS_CARD_CHANCE,HIGGS EXCHANGE TICKET:HIGGS_EXCHANGE_TICKET,BLUETOOTH EARPHONE:BLUETOOTH_EARPHONE,POWER BANK:POWER_BANK,3 IN 1 CHARGING CABLE:THREE_IN_ONE_CHARGING_CABLE) */
    type?:
      | 'GOLD'
      | 'VTOKEN'
      | 'PHONE_CHARGE_TICKET'
      | 'FLOW_CARD'
      | 'HIGGS_CARD_CHANCE'
      | 'HIGGS_EXCHANGE_TICKET'
      | 'BLUETOOTH_EARPHONE'
      | 'POWER_BANK'
      | 'THREE_IN_ONE_CHARGING_CABLE';
    /**   ID， prop_product    */
    propId?: string;
    /**         ,   null，       */
    expired?: boolean;
  };

  type UserPropUseAO = {
    /** id */
    id: string;
    /** use prop num */
    useNum: number;
    /** target,optional */
    target?: string;
    /** target2,optional */
    phone?: string;
    /** target3,optional */
    target3?: string;
  };

  type UserPropVO = {
    /**   Id */
    id?: string;
    /**      */
    createdDate?: number;
    /**      */
    modifiedDate?: number;
    /**   ID */
    propId?: string;
    /**   ID */
    userId?: string;
    /**      */
    stackNum?: number;
    /**       ，       1970-01-01 */
    startTime?: number;
    /**       ，       9999-12-31 */
    endTime?: number;
    propProductVo?: PropProductVO;
  };

  type UserSettlementBannerVO = {
    /**   Id */
    id?: string;
    /**      */
    createdDate?: number;
    /**      */
    modifiedDate?: number;
    /**       */
    goldAmount?: BigDecimalString;
    /** WSP */
    dstAmount?: BigDecimalString;
    /**     */
    rpAmount?: BigDecimalString;
    /** bankruptcy create */
    bankruptcy?: boolean;
    /** activity type Enum (First Recharge:FIRST_CHARGE,Check in:SIGN_IN,Lucky Wheel:TURNTABLE,Higgs:HIGGS,7 Days Event:SEVEN_DAY_ACTIVITIES,Ranking:RANKING_LIST,PAY:PAY,TASK:GAME_HALL_TASK,BankruptCY:BANKRUPTCY_ACTIVITY,special recharge:SPECIAL_RECHARGE,Tomorrow gift:TOMORROW_GIFT,fission task:FISSION_TASK,novice 5 days tasks:NOVICE_FIVE_DAYS,week recharge:WEEK_RECHARGE,growth plan:GROWTH_PLAN,recovery recharge gift:RECOVERY_RECHARGE,welfare entry:WELFARE_ENTRY,Game Invite:GAME_INVITE,topup entry:TOPUP_ENTRY,recovery smash egg:RECOVERY_SMASH_EGG,pay activities entry:PAY_ENTRY,benefit:BENEFIT) */
    activitiesType?:
      | 'FIRST_CHARGE'
      | 'SIGN_IN'
      | 'TURNTABLE'
      | 'HIGGS'
      | 'SEVEN_DAY_ACTIVITIES'
      | 'RANKING_LIST'
      | 'PAY'
      | 'GAME_HALL_TASK'
      | 'BANKRUPTCY_ACTIVITY'
      | 'SPECIAL_RECHARGE'
      | 'TOMORROW_GIFT'
      | 'FISSION_TASK'
      | 'NOVICE_FIVE_DAYS'
      | 'WEEK_RECHARGE'
      | 'GROWTH_PLAN'
      | 'RECOVERY_RECHARGE'
      | 'WELFARE_ENTRY'
      | 'GAME_INVITE'
      | 'TOPUP_ENTRY'
      | 'RECOVERY_SMASH_EGG'
      | 'PAY_ENTRY'
      | 'BENEFIT';
    /** pay product type Enum (general:GENERAL,firstRecharge:ACTIVITY,bankruptcy:BANKRUPTCY,special:SPECIAL,week recharge:WEEK,month card:MONTH,recovery:RECOVERY,growth plan:GROWTH) */
    productType?:
      | 'GENERAL'
      | 'ACTIVITY'
      | 'BANKRUPTCY'
      | 'SPECIAL'
      | 'WEEK'
      | 'MONTH'
      | 'RECOVERY'
      | 'GROWTH';
    /** activity ID */
    activityId?: string;
  };

  type UserStatVO = {
    /** WSP amount */
    dstTotalAmount?: BigDecimalString;
    /** total gold amount */
    goldTotalAmount?: BigDecimalString;
    /** cash gold amount */
    cashGoldTotalAmount?: BigDecimalString;
    /** bonus gold amount */
    bonusGoldTotalAmount?: BigDecimalString;
    /** enable withdrawal gold amount */
    enableWithdrawalGoldTotalAmount?: BigDecimalString;
    /** WSP to RP amount */
    dstToRpTotalAmount?: BigDecimalString;
    /** total gold to Rp amount */
    goldToRpTotalAmount?: BigDecimalString;
  };

  type UserTokenExchangeGoldAO = {
    /** token   */
    dstAmount: BigDecimalStringAO;
  };

  type UserTokenLogPageAO = {
    /**     (  :1) */
    pageIndex?: number;
    /**     (  :8) */
    pageSize?: number;
    /**      Enum (Withdrawal:withdrawal,Recharge:recharge,Lottery Draw:lottery_draw,WSP Exchange to Coin:exchange_gold,Play Game:play_game,Team Recharge Rewards:team_recharge_rewards,Activity:activity,Mission:task,Redemption Code:redeem_code,In-Game Mail:message_reward,Admin Change:admin_change,Lucky Wheel Free:lucky_wheel,Lucky Wheel Gold:lucky_wheel_gold,Lucky Wheel Diamond:lucky_wheel_diamond,prop:prop,check in:check_in,Expiration Clearing:expire_clear) */
    sourceType?:
      | 'withdrawal'
      | 'recharge'
      | 'lottery_draw'
      | 'exchange_gold'
      | 'play_game'
      | 'team_recharge_rewards'
      | 'activity'
      | 'task'
      | 'redeem_code'
      | 'message_reward'
      | 'admin_change'
      | 'lucky_wheel'
      | 'lucky_wheel_gold'
      | 'lucky_wheel_diamond'
      | 'prop'
      | 'check_in'
      | 'expire_clear';
    /**    */
    year?: number;
    /**    */
    month?: number;
  };

  type UserTokenLogStatAO = {
    /**      Enum (Withdrawal:withdrawal,Recharge:recharge,Lottery Draw:lottery_draw,WSP Exchange to Coin:exchange_gold,Play Game:play_game,Team Recharge Rewards:team_recharge_rewards,Activity:activity,Mission:task,Redemption Code:redeem_code,In-Game Mail:message_reward,Admin Change:admin_change,Lucky Wheel Free:lucky_wheel,Lucky Wheel Gold:lucky_wheel_gold,Lucky Wheel Diamond:lucky_wheel_diamond,prop:prop,check in:check_in,Expiration Clearing:expire_clear) */
    sourceType?:
      | 'withdrawal'
      | 'recharge'
      | 'lottery_draw'
      | 'exchange_gold'
      | 'play_game'
      | 'team_recharge_rewards'
      | 'activity'
      | 'task'
      | 'redeem_code'
      | 'message_reward'
      | 'admin_change'
      | 'lucky_wheel'
      | 'lucky_wheel_gold'
      | 'lucky_wheel_diamond'
      | 'prop'
      | 'check_in'
      | 'expire_clear';
    /**    */
    year?: number;
    /**    */
    month?: number;
  };

  type UserTokenLogStatVO = {
    /**       */
    beanefitsAmount?: BigDecimalString;
    /**      */
    payoutAmount?: BigDecimalString;
  };

  type UserTokenLogVO = {
    /**   Id */
    id?: string;
    /**      */
    createdDate?: number;
    /**      */
    modifiedDate?: number;
    /**      Enum (Withdrawal:withdrawal,Recharge:recharge,Lottery Draw:lottery_draw,WSP Exchange to Coin:exchange_gold,Play Game:play_game,Team Recharge Rewards:team_recharge_rewards,Activity:activity,Mission:task,Redemption Code:redeem_code,In-Game Mail:message_reward,Admin Change:admin_change,Lucky Wheel Free:lucky_wheel,Lucky Wheel Gold:lucky_wheel_gold,Lucky Wheel Diamond:lucky_wheel_diamond,prop:prop,check in:check_in,Expiration Clearing:expire_clear) */
    tokenSourceType?:
      | 'withdrawal'
      | 'recharge'
      | 'lottery_draw'
      | 'exchange_gold'
      | 'play_game'
      | 'team_recharge_rewards'
      | 'activity'
      | 'task'
      | 'redeem_code'
      | 'message_reward'
      | 'admin_change'
      | 'lucky_wheel'
      | 'lucky_wheel_gold'
      | 'lucky_wheel_diamond'
      | 'prop'
      | 'check_in'
      | 'expire_clear';
    /**   Id */
    sourceId?: string;
    /**      （     ） */
    tokenSourceName?: string;
    /**    Enum ( :ADD, :SUB) */
    direct?: 'ADD' | 'SUB';
    /**     */
    amount?: BigDecimalString;
    /**    Enum (success:success,fail:fail,processing:processing) */
    txStatus?: 'success' | 'fail' | 'processing';
  };

  type UserTokenUsableVO = {
    /**       */
    amount?: BigDecimalString;
    /**          */
    dailyCountMaxLimit?: number;
    /**          */
    dailyAmountMaxLimit?: number;
    /**          */
    onceAmountMaxLimit?: number;
  };

  type UserWalletInfoVO = {
    /** user balance info（vtoken / cash gold /bonus gold） */
    userCoinItems?: UserBalanceItemVO[];
    /**        */
    expLevel?: number;
    /**            () */
    expLevelFee?: BigDecimalString;
    /**         */
    baseActive?: BigDecimalString;
    /**         */
    additionActive?: BigDecimalString;
    /**        */
    teamLevel?: number;
    /**                   */
    teamLevelCommissionRate?: BigDecimalString;
    /**      pass    */
    collectNum?: number;
    /**           */
    mobile?: string;
    /**         (s) */
    latestBindMobileTime?: string;
  };

  type UserWalletLevelVO = {
    /**        Enum (LV0:zero,LV1:one,LV2:two,LV3:three,LV4:four,LV5:five) */
    level?: 'zero' | 'one' | 'two' | 'three' | 'four' | 'five';
    /**     */
    expValue?: number;
    /**            */
    nextLevelDiffExp?: number;
    /**       */
    hasAuth?: boolean;
    /**     */
    levelNo?: number;
  };

  type vGameClaimNoviceTaskControllerParams = {
    /** task id,Long   (0~9223372036854775807) */
    taskId: string;
  };

  type vGameClaimTomorrowGiftTaskControllerParams = {
    /** task id,Long   (0~9223372036854775807) */
    taskId: string;
  };

  type VnUserInfoVO = {
    /**   Id */
    userId?: string;
    /**    */
    nickName?: string;
    /**    */
    timeZone?: string;
    /**    */
    avatar?: string;
    /**    */
    email?: string;
    /**      */
    createTime?: number;
  };

  type WidthdrawIDateAO = {
    /**     (  :1) */
    pageIndex?: number;
    /**     (  :8) */
    pageSize?: number;
    /**         ， -          ； -           */
    amountOrder: boolean;
    /**     ，0    */
    count: number;
  };

  type WidthdrawITopNAO = {
    /**      */
    startTime?: number;
    /**      */
    endTime?: number;
    /** count */
    count?: number;
  };

  type WidthdrawlUserInfoVO = {
    /**   Id */
    id?: string;
    /**      */
    createdDate?: number;
    /**      */
    modifiedDate?: number;
    /**   ID */
    userId?: string;
    /**    */
    name?: string;
    /**    */
    portrait?: string;
    /**    */
    amount?: BigDecimalString;
  };

  type WithdrawalChannelBindAO = {
    /**      Enum (MOCK_CHANNEL:MOCK_CHANNEL,EWALLET_DANA:EWALLET_DANA,EWALLET_GOPAY:EWALLET_GOPAY,EWALLET_LINKAJA:EWALLET_LINKAJA,EWALLET_OVO:EWALLET_OVO,EWALLET_SHOPEEPAY:EWALLET_SHOPEEPAY,QRIS:QRIS,Bank Mandiri (Persero) Tbk:BANK_MANDIRI,PT Bank Permata Tbk:BANK_PERMATA,Bank Negara Indonesia:BANK_BNI,PT Bank CIMB Niaga Tbk:BANK_CIMB,Bank Central Asia Tbk:BANK_BCA,Bank Rakyat Indonesia:BANK_BRI,Bank Syariah Indonesia:BANK_BSI,Bank Danamon Indonesia Tbk :BANK_DANAMON) */
    channelType:
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
    /**     */
    countryCode: number;
    /**    (   /   ) */
    channelNumber: string;
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

  type WithdrawalLogPageAO = {
    /**     (  :1) */
    pageIndex?: number;
    /**     (  :8) */
    pageSize?: number;
    /**      */
    startTime?: number;
    /**      */
    endTime?: number;
    /**      */
    statusList?: (
      | 'AUDIT_PROGRESS'
      | 'AUDIT_PASSED'
      | 'AUDIT_FAIL'
      | 'COMPLETED'
      | 'WITHDRAWAL_FAIL'
      | 'WITHDRAWAL_CLOSE'
      | 'WITHDRAWAL_QUEUE'
      | 'WITHDRAWAL_QUEUE_CANCEL'
    )[];
    /**      */
    channelTypes?: ('EWALLET' | 'VA')[];
  };

  type WithdrawalLogVO = {
    /**   Id */
    id?: string;
    /**      */
    createdDate?: number;
    /**      */
    modifiedDate?: number;
    /**      Enum (in process:AUDIT_PROGRESS,    :AUDIT_PASSED,FAILED:AUDIT_FAIL,Completed:COMPLETED,FAILED:WITHDRAWAL_FAIL,CLOSED:WITHDRAWAL_CLOSE,Join the queue:WITHDRAWAL_QUEUE,Cancel queue:WITHDRAWAL_QUEUE_CANCEL) */
    status?:
      | 'AUDIT_PROGRESS'
      | 'AUDIT_PASSED'
      | 'AUDIT_FAIL'
      | 'COMPLETED'
      | 'WITHDRAWAL_FAIL'
      | 'WITHDRAWAL_CLOSE'
      | 'WITHDRAWAL_QUEUE'
      | 'WITHDRAWAL_QUEUE_CANCEL';
    /**    */
    reason?: string;
    /**      */
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
    channelName?: string;
    /**       */
    fee?: BigDecimalString;
  };

  type WithdrawalPageQueryAO = {
    /** withdrawal type Enum (  :NORMAL,    :INITIAL_BENEFIT,    :SMALL_WITHDRAW,    :LIMIT_WITHDRAW,    :QUEUE_WITHDRAW,activity withdraw:ACTIVITY) */
    withdrawalType:
      | 'NORMAL'
      | 'INITIAL_BENEFIT'
      | 'SMALL_WITHDRAW'
      | 'LIMIT_WITHDRAW'
      | 'QUEUE_WITHDRAW'
      | 'ACTIVITY';
    /** activity type Enum (First Recharge:FIRST_CHARGE,Check in:SIGN_IN,Lucky Wheel:TURNTABLE,Higgs:HIGGS,7 Days Event:SEVEN_DAY_ACTIVITIES,Ranking:RANKING_LIST,PAY:PAY,TASK:GAME_HALL_TASK,BankruptCY:BANKRUPTCY_ACTIVITY,special recharge:SPECIAL_RECHARGE,Tomorrow gift:TOMORROW_GIFT,fission task:FISSION_TASK,novice 5 days tasks:NOVICE_FIVE_DAYS,week recharge:WEEK_RECHARGE,growth plan:GROWTH_PLAN,recovery recharge gift:RECOVERY_RECHARGE,welfare entry:WELFARE_ENTRY,Game Invite:GAME_INVITE,topup entry:TOPUP_ENTRY,recovery smash egg:RECOVERY_SMASH_EGG,pay activities entry:PAY_ENTRY,benefit:BENEFIT) */
    activityType:
      | 'FIRST_CHARGE'
      | 'SIGN_IN'
      | 'TURNTABLE'
      | 'HIGGS'
      | 'SEVEN_DAY_ACTIVITIES'
      | 'RANKING_LIST'
      | 'PAY'
      | 'GAME_HALL_TASK'
      | 'BANKRUPTCY_ACTIVITY'
      | 'SPECIAL_RECHARGE'
      | 'TOMORROW_GIFT'
      | 'FISSION_TASK'
      | 'NOVICE_FIVE_DAYS'
      | 'WEEK_RECHARGE'
      | 'GROWTH_PLAN'
      | 'RECOVERY_RECHARGE'
      | 'WELFARE_ENTRY'
      | 'GAME_INVITE'
      | 'TOPUP_ENTRY'
      | 'RECOVERY_SMASH_EGG'
      | 'PAY_ENTRY'
      | 'BENEFIT';
  };

  type WithdrawalTopNVO = {
    /**   Id */
    id?: string;
    /**      */
    createdDate?: string;
    /**      */
    modifiedDate?: number;
    /**        */
    amount?: BigDecimalString;
    /**    */
    name?: string;
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

  type WsFeedbackAO = {
    /**        Enum (fission task batch reward:FISSION_TASK_BATCHREWARD_MESSAGE,fission invite reward:FISSION_INVITE_REWARD_MESSAGE,Game settlement message:GAME_SETTLEMENT_MESSAGE,ROLL message:ROLL_MESSAGE,Fission tasks batch reward:TASK_FISSION_REWARDS_MESSAGE,Fission invite tasks batch reward:TASK_FISSION_INVITE_REWARDS_MESSAGE,Fission invite group tasks batch reward:TASK_FISSION_INVITE_GROUP_REWARDS_MESSAGE) */
    messageType?:
      | 'FISSION_TASK_BATCHREWARD_MESSAGE'
      | 'FISSION_INVITE_REWARD_MESSAGE'
      | 'GAME_SETTLEMENT_MESSAGE'
      | 'ROLL_MESSAGE'
      | 'TASK_FISSION_REWARDS_MESSAGE'
      | 'TASK_FISSION_INVITE_REWARDS_MESSAGE'
      | 'TASK_FISSION_INVITE_GROUP_REWARDS_MESSAGE';
    /**        */
    feedbackIds?: string[];
  };

  type WvFlopInfoRewardVO = {
    /**   ID */
    rewardId?: number;
    /**   ID */
    imageId?: string;
    /**      PropertyConverter(UploadKeyConverterEditor) */
    imageUrl?: string;
    /**      Enum (HIGGS:HIGGS,  :COIN) */
    rewardEnum?: 'HIGGS' | 'COIN';
    /**      */
    rewardAmount?: BigDecimalString;
    /**     ID */
    materialId?: string;
    /**        PropertyConverter(UploadKeyConverterEditor) */
    materialImageUrl?: string;
    /**      */
    idx?: number;
    /**       */
    flop?: boolean;
  };

  type WvFlopInfoVO = {
    /**        */
    tasks?: TaskItemVO[];
    /**        */
    flopRewards?: WvFlopInfoRewardVO[];
    prop?: IdVO;
    /**      */
    higgsBalance?: BigDecimalString;
    /**        */
    currentFlopCount?: number;
    /**          */
    getAllFlopCount?: boolean;
    /**       */
    share?: boolean;
    /**     Id */
    shareTaskId?: string;
  };

  type WvFlopPropAO = {
    /**   ID */
    propId: string;
  };
}
