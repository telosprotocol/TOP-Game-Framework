declare namespace RAPI {
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

  type bannerListBannerControllerParams = {
    /** show scene,Enum (Game Homepage:GAME_HOME,Promotion:PROMOTION,Academy Center:COLLEGE_CENTER,Player Center:GAME_PLAYER_CENTER,Player Center Beginner Page:GAME_PLAYER_CENTER_NOVICE,Wallet Page Bottom:WALLET_FOOTER,Fortune Center Homepage:FORTUNE_HOME) */
    showScene:
      | 'GAME_HOME'
      | 'PROMOTION'
      | 'COLLEGE_CENTER'
      | 'GAME_PLAYER_CENTER'
      | 'GAME_PLAYER_CENTER_NOVICE'
      | 'WALLET_FOOTER'
      | 'FORTUNE_HOME';
  };

  type BannerListVO = {
    /**   Id */
    id?: string;
    /**      */
    createdDate?: number;
    /**      */
    modifiedDate?: number;
    /**    */
    title?: string;
    /**    PropertyConverter(UploadKeyConverterEditor) */
    imageUrl?: string;
    /**   Url */
    linkUrl?: string;
    /**      Enum (Game Homepage:GAME_HOME,Promotion:PROMOTION,Academy Center:COLLEGE_CENTER,Player Center:GAME_PLAYER_CENTER,Player Center Beginner Page:GAME_PLAYER_CENTER_NOVICE,Wallet Page Bottom:WALLET_FOOTER,Fortune Center Homepage:FORTUNE_HOME) */
    showScene?:
      | 'GAME_HOME'
      | 'PROMOTION'
      | 'COLLEGE_CENTER'
      | 'GAME_PLAYER_CENTER'
      | 'GAME_PLAYER_CENTER_NOVICE'
      | 'WALLET_FOOTER'
      | 'FORTUNE_HOME';
  };

  type CoinPriceInfoVO = {
    /** dst usdt（1dst=0.1u） */
    dstToUsdt?: BigDecimalString;
    /** dst RP  （1dst=1000rp */
    dstToRp?: BigDecimalString;
    /** dst RP  （1dst=1000rp */
    dstToGold?: BigDecimalString;
    /**    RP  （1Rp=1   */
    rpToGold?: BigDecimalString;
    /**          */
    dstusdtIncreaseForMonth?: BigDecimalString;
    /**           */
    dstusdtIncreaseForDay?: BigDecimalString;
  };

  type CollegeCenterPageAO = {
    /**     (  :1) */
    pageIndex?: number;
    /**     (  :8) */
    pageSize?: number;
    /**   tabId( -    ) */
    collegeTabId?: string;
  };

  type CollegeCenterPageVO = {
    /**   Id */
    id?: string;
    /**      */
    createdDate?: number;
    /**      */
    modifiedDate?: number;
    /**    */
    title?: string;
    /**    PropertyConverter(UploadKeyConverterEditor) */
    imageUrl?: string;
    /**   Url */
    linkUrl?: string;
    /** tabId */
    tabId?: string;
    /** tab   */
    tabName?: string;
    /**       (    ) */
    startTimestamp?: number;
    /**        */
    endTimestamp?: number;
    /**    Enum (END:END,PROCESSING:PROCESSING,NOT STARTED:NOT_STARTED) */
    showStatus?: 'END' | 'PROCESSING' | 'NOT_STARTED';
    /**    */
    sort?: number;
    /**      name */
    operationUserName?: string;
  };

  type CollegeCenterTabListVO = {
    /**   Id */
    id?: string;
    /** tab   */
    name?: string;
  };

  type ConfigVO = {
    /**    */
    fullName?: string;
    /**     (spring.application.name) */
    systemName?: string;
    /**    (magic.system.version) */
    systemVersion?: string;
    /**       (magic.system.balanced_datacenter_id) */
    balancedDataCenterId?: number;
    /**      (magic.system.balanced_worker_id) */
    balancedWorkerId?: number;
    /**   Body  (magic.http.max_body_text_size) */
    maxBodyTextSize?: string;
    /**   IP */
    localIpByNetcard?: string;
    /**   IP */
    requestIp?: string;
    /**       */
    activeUsers?: string;
    /**      */
    props?: Record<string, any>;
  };

  type dictionaryConfigControllerParams = {
    /** Filed,  (1~255) */
    key: string;
  };

  type dictionaryDevDocControllerParams = {
    /**       */
    source: boolean;
  };

  type downloadDevDocControllerParams = {
    /**   ,   ''    */
    path: string;
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

  type GameFaqPageAO = {
    /**     (  :1) */
    pageIndex?: number;
    /**     (  :8) */
    pageSize?: number;
    /** gameFaqId */
    id?: string;
  };

  type GameFaqVO = {
    /** id */
    id?: string;
    /**      */
    createdDate?: number;
    /**      */
    modifiedDate?: number;
    /**    */
    faqType?: Record<string, any>;
    /**    */
    title?: string;
    /**    */
    content?: string;
    /**    */
    icon?: string;
  };

  type GameInfoV2VO = {
    /**   Id */
    id?: string;
    /**    */
    name?: string;
    /**    PropertyConverter(UploadKeyConverterEditor) */
    icon?: string;
    /** subscript type Enum (NONE:NONE,HOT:HOT,NEW:NEW) */
    subscriptType?: 'NONE' | 'HOT' | 'NEW';
    /**        , GameOrientationEnum Enum (HORIZONTAL:HORIZONTAL,VERTICAL:VERTICAL) */
    orientation?: 'HORIZONTAL' | 'VERTICAL';
    /**        Enum (ONLINE:ONLINE,MAINTENANCE:MAINTENANCE,TESTING:TESTING,OFFLINE:OFFLINE) */
    gameState?: 'ONLINE' | 'MAINTENANCE' | 'TESTING' | 'OFFLINE';
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

  type GameInfoWangZhuanVO = {
    /**   Id */
    id?: string;
    /**    */
    name?: string;
    /**    PropertyConverter(UploadKeyConverterEditor) */
    icon?: string;
    /**        , GameOrientationEnum Enum (HORIZONTAL:HORIZONTAL,VERTICAL:VERTICAL) */
    orientation?: 'HORIZONTAL' | 'VERTICAL';
  };

  type GameMenuItemDetailV2VO = {
    /**   Id */
    id?: string;
    /**       Enum (GAME:GAME,COLLECTION:COLLECTION) */
    type?: 'GAME' | 'COLLECTION';
    /**      id */
    nameId?: string;
    /**      */
    nameText?: string;
    /**      */
    gameInfoList?: GameInfoV2VO[];
  };

  type GameMenuItemDetailVO = {
    /**   Id */
    id?: string;
    /**      */
    createdDate?: number;
    /**      */
    modifiedDate?: number;
    /**       Enum (GAME:GAME,COLLECTION:COLLECTION) */
    type?: 'GAME' | 'COLLECTION';
    /**      id */
    nameId?: string;
    /**   Id */
    iconId?: string;
    /**   id   */
    gameIds?: string[];
    /**          */
    gameNames?: string[];
    /**     ，     */
    sort?: number;
    /**    Enum (ONLINE:ONLINE,MAINTENANCE:MAINTENANCE,TESTING:TESTING,OFFLINE:OFFLINE) */
    state?: 'ONLINE' | 'MAINTENANCE' | 'TESTING' | 'OFFLINE';
    /**      */
    nameText?: string;
    /**   url PropertyConverter(UploadKeyConverterEditor) */
    imageUrl?: string;
    /**      */
    gameInfoList?: GameInfoVO[];
  };

  type GameNoticePageAO = {
    /**     (  :1) */
    pageIndex?: number;
    /**     (  :8) */
    pageSize?: number;
    /** gameNoticeId */
    id?: string;
  };

  type GameNoticeVO = {
    /**   Id */
    id?: string;
    /**      */
    createdDate?: number;
    /**      */
    modifiedDate?: number;
    /**      */
    gameName?: string;
    /**      */
    nickname?: string;
    /**        */
    win?: BigDecimalString;
    /**    */
    times?: BigDecimalString;
  };

  type getConfigControllerParams = {
    /** code,  (1~255) */
    code: string;
  };

  type getVisitorWithdrawalInfoV2WithdrawalControllerParams = {
    /** user ID,Long   (0~9223372036854775807) */
    userId: string;
  };

  type isCompletedNoviceGuideTouristUserLogControllerParams = {
    deviceId?: string;
  };

  type JsonObject = true;

  type listFileDevDocControllerParams = {
    /**   ,   ''    */
    path: string;
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

  type ListVOBannerListVO = {
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
    data: BannerListVO[];
  };

  type ListVOCollegeCenterTabListVO = {
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
    data: CollegeCenterTabListVO[];
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

  type ListVOGameInfoWangZhuanVO = {
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
    data: GameInfoWangZhuanVO[];
  };

  type ListVOGameMenuItemDetailV2VO = {
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
    data: GameMenuItemDetailV2VO[];
  };

  type ListVOGameMenuItemDetailVO = {
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
    data: GameMenuItemDetailVO[];
  };

  type ListVOGameNoticeVO = {
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
    data: GameNoticeVO[];
  };

  type ListVOSecretKeyVO = {
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
    data: SecretKeyVO[];
  };

  type ListVOString = {
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
    data: string[];
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

  type ListVOUserInviteRechargeRankingVO = {
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
    data: UserInviteRechargeRankingVO[];
  };

  type ListVOUserInviteRechargeTeamRankingVO = {
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
    data: UserInviteRechargeTeamRankingVO[];
  };

  type ListVOUserPlayGameWeekRankingVO = {
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
    data: UserPlayGameWeekRankingVO[];
  };

  type ListVOWidthdrawlUserInfoVO = {
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
  };

  type ListVOWithdrawalRechargeTopNVO = {
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
    data: WithdrawalRechargeTopNVO[];
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

  type ObjectVOCoinPriceInfoVO = {
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
    data: CoinPriceInfoVO;
  };

  type ObjectVOConfigVO = {
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
    data: ConfigVO;
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

  type ObjectVOMapStringJsonObject = {
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
    data: Record<string, any>;
  };

  type ObjectVOMapStringString = {
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
    data: Record<string, any>;
  };

  type ObjectVOObject = {
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
    data: Record<string, any>;
  };

  type ObjectVOSignVO = {
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
    data: SignVO;
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

  type ObjectVOUploadStsVO = {
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
    data: UploadStsVO;
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

  type ObjectVOWithdrawVisitorInfoVO = {
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
    data: WithdrawVisitorInfoVO;
  };

  type PageVOCollegeCenterPageVO = {
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
    data: CollegeCenterPageVO[];
    /**      */
    total: number;
  };

  type PageVOGameFaqVO = {
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
    data: GameFaqVO[];
    /**      */
    total: number;
  };

  type payInfoNotifyPayControllerParams = {
    direction?: string;
    platformName?: string;
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

  type respDevDocControllerParams = {
    /**    */
    language: string;
  };

  type SaveEmailAO = {
    /**    */
    email: string;
  };

  type SecretKeyVO = {
    /**   ID */
    accessId?: string;
    /**    */
    accessKey?: string;
    /**    */
    type?: number;
    /**      */
    invalidTime?: string;
    /**    */
    remark?: string;
  };

  type SignAO = {
    /**      */
    accessKey: string;
    /**      */
    content?: string;
  };

  type SignVO = {
    /**         */
    signature?: string;
    /**         URL   */
    signatureUrl?: string;
    /**     Base64      */
    signatureBase64?: string;
    /**     Base64    URL   */
    signatureBase64Url?: string;
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

  type TouristUserLogAO = {
    /**   ID */
    userId: string;
    /**     id */
    deviceId: string;
  };

  type UploadStsVO = {
    /**      */
    endPoint?: string;
    /**       */
    bucketName?: string;
    /**   ID */
    accessKeyId?: string;
    /**      */
    accessKeySecret?: string;
    /**   Token */
    securityToken?: string;
    /**      */
    expiration?: number;
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

  type UserInviteRechargeRankingVO = {
    /** id */
    id?: string;
    /**   id */
    userId?: string;
    /**          */
    nickName?: string;
    /**      */
    avatar?: string;
    /**     rp   */
    totalRpAmount?: BigDecimalString;
    /**      */
    createdDate?: number;
  };

  type UserInviteRechargeTeamRankingVO = {
    /** id */
    id?: string;
    /**   id */
    userId?: string;
    /**          */
    nickName?: string;
    /**      */
    avatar?: string;
    /**     rp   */
    totalRpAmount?: BigDecimalString;
    /**      */
    createdDate?: number;
    /**     （  ） */
    teamCount?: number;
    /**          （ 3 ） */
    avatars?: string[];
  };

  type UserPlayGameWeekRankingVO = {
    /**    */
    ranking?: number;
    /**   ID */
    userId?: string;
    /**      */
    nickName?: string;
    /**      */
    avatar?: string;
    /**     DST   */
    totalAmount?: BigDecimalString;
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

  type WithdrawalRechargeTopNVO = {
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
    /** true-recharge false-withdrawal */
    recharge?: boolean;
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

  type WithdrawVisitorInfoVO = {
    /** withdraw type and amount list */
    withdrawTypeAndAmountList?: WithdrawTypeAndAmount[];
    /** withdraw type Enum (  :NORMAL,    :INITIAL_BENEFIT,    :SMALL_WITHDRAW,    :LIMIT_WITHDRAW,    :QUEUE_WITHDRAW,activity withdraw:ACTIVITY) */
    withdrawType?:
      | 'NORMAL'
      | 'INITIAL_BENEFIT'
      | 'SMALL_WITHDRAW'
      | 'LIMIT_WITHDRAW'
      | 'QUEUE_WITHDRAW'
      | 'ACTIVITY';
    /** withdraw channel Enum (MOCK_CHANNEL:MOCK_CHANNEL,EWALLET_DANA:EWALLET_DANA,EWALLET_GOPAY:EWALLET_GOPAY,EWALLET_LINKAJA:EWALLET_LINKAJA,EWALLET_OVO:EWALLET_OVO,EWALLET_SHOPEEPAY:EWALLET_SHOPEEPAY,QRIS:QRIS,Bank Mandiri (Persero) Tbk:BANK_MANDIRI,PT Bank Permata Tbk:BANK_PERMATA,Bank Negara Indonesia:BANK_BNI,PT Bank CIMB Niaga Tbk:BANK_CIMB,Bank Central Asia Tbk:BANK_BCA,Bank Rakyat Indonesia:BANK_BRI,Bank Syariah Indonesia:BANK_BSI,Bank Danamon Indonesia Tbk :BANK_DANAMON) */
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
    /** channel view info */
    account?: WithdrawalForAccountViewVO[];
    fee?: WithdrawalFeeVO;
  };
}
