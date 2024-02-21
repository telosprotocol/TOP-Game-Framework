import { webpFilter } from '@/directives/webp';
export function convertUrlExpression(url: string, defaultUrl = 'none') {
  if (url) {
    return `url("${url}")`;
  }
  return defaultUrl;
}
export function convertBgImageStyle(
  imageUrl: string
): Partial<CSSStyleDeclaration>;
export function convertBgImageStyle(
  imageUrl: string,
  needTryConvertToWebp: boolean
): Partial<CSSStyleDeclaration>;
export function convertBgImageStyle(
  imageUrl: string,
  extraOptions: Partial<CSSStyleDeclaration>
): Partial<CSSStyleDeclaration>;
export function convertBgImageStyle(
  imageUrl: string,
  needTryConvertToWebp: boolean,
  extraOptions: Partial<CSSStyleDeclaration>
): Partial<CSSStyleDeclaration>;

export function convertBgImageStyle(
  imageUrl: string,
  needTryConvertToWebpOrOptions?: boolean | Partial<CSSStyleDeclaration>,
  extraOptions?: Partial<CSSStyleDeclaration>
) {
  let needTryConvertToWebp = false,
    restOptions = extraOptions;
  if (needTryConvertToWebpOrOptions != null) {
    if (typeof needTryConvertToWebpOrOptions === 'boolean') {
      needTryConvertToWebp = needTryConvertToWebpOrOptions;
    } else {
      restOptions = needTryConvertToWebpOrOptions;
    }
  }
  if (imageUrl) {
    const url = needTryConvertToWebp ? webpFilter(imageUrl) : imageUrl;
    return {
      ...restOptions,
      backgroundImage: convertUrlExpression(url),
    };
  }
  return {
    ...restOptions,
  };
}
