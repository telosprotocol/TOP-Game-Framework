interface GetterConfigType {
  [key: string]: (...args: any[]) => any;
}

export type IGetterType<TGetterConfigType extends GetterConfigType> = {
  [key in keyof TGetterConfigType]: ReturnType<TGetterConfigType[key]>;
};

/**
 *    Getter  ，key
 */
export type IModuleGetterType<
  TGetterConfigType extends GetterConfigType,
  TModuleName extends string
> = {
  [Property in Extract<
    keyof TGetterConfigType,
    string
  > as `${TModuleName}/${Property}`]: ReturnType<TGetterConfigType[Property]>;
};

//`${TModuleName}/${Property}`
