type RouteConfig = import('vue-router').RouteConfig;

type IRouteCommonMeta = {
  titleLang?: string;
  title?: string;
  /**
   *         （             ）
   *
   */
  requireLogined?: boolean;

  noKeepAlive?: boolean;

  /**
   *
   * true:
   */
  noWebviewBack?: boolean;
};
type IAbstractRouteOption<TRouteMeta extends IRouteCommonMeta> = Omit<
  RouteConfig,
  'meta' | 'component'
> & {
  meta: TRouteMeta;
  component?: any;
};
type IBaseRouteOption = IAbstractRouteOption<
  IRouteCommonMeta & {
    [otherProps: string]: string | boolean;
  }
>;
