/**   
Enum (  :GOLD,VTOKEN:VTOKEN,   :PHONE_CHARGE_TICKET,   :FLOW_CARD,Higgs    :HIGGS_CARD_CHANCE,Higgs   :HIGGS_EXCHANGE_TICKET) */
export type IVPropType = API.PropProductVO['type'];

export type IUserPropItem = Omit<API.UserPropVO, 'propProductVo'> &
  Required<Pick<API.UserPropVO, 'propProductVo'>> & {
    /**
     *      （endTime     ）
     */
    _leftMs?: number;
  };

export type IUserPropRewardItem = Omit<
  API.PropRewardDetailVO,
  'id' | 'createDate' | 'updateDate'
> & {
  /**
   *     （              ）
   */
  descriptionText?: string;
};
export type IUserPropRewardItemBase = {
  type: API.PropRewardDetailVO['type'] | 'BONUS_GOLD';
  /**
   *
   */
  propNum: number;
  nameText?: string;
  imageUrl?: string;

  //#region
  /**
   *   value
   */
  num?: BigDecimalString;
  propId?: string;
  propBagId?: string;
  usable?: boolean;
  autoUse?: boolean;
  //#endregion
};

// Pick<
//   API.PropRewardDetailVO,
//   'nameText' | 'imageUrl' | 'propNum' | 'type'
// >;
