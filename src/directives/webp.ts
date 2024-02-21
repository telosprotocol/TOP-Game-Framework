import { isSupportWebp } from '@/utils/webp';
import type { DirectiveOptions } from 'vue';
import Vue from 'vue';
import type { DirectiveBinding } from 'vue/types/options';
const BASE64_PREFIX = 'data:image';

/**
 *   webp       url   webp
 * @param srcValue
 */
function tryConvertWebPUrl(srcValue: string) {
  if (
    isSupportWebp() &&
    srcValue.substr(0, BASE64_PREFIX.length) !== BASE64_PREFIX
  ) {
    const urlPartList = srcValue.split('?');
    const pathPart = urlPartList[0];
    const isWebp = pathPart.substr(pathPart.length - 5, 5) === '.webp';
    if (isWebp) {
      return srcValue;
    }
    urlPartList[0] = pathPart + '.webp';
    return urlPartList.join('?');
  }
  return srcValue;
}
function update(el: HTMLElement, binding: DirectiveBinding) {
  const bindingKeys = Object.keys(binding);
  const isBind = !bindingKeys.includes('oldValue');
  const isBindTrue = isBind && binding.expression === undefined;
  if (binding.oldValue === binding.value && !isBindTrue) {
    return;
  }
  let bindingValue = binding.value;
  if (!bindingValue && isBindTrue) {
    bindingValue = true;
  }
  let type = binding.arg;
  if (!type) {
    if (el.tagName === 'IMG') {
      type = 'src';
    } else {
      type = 'bg';
    }
  }
  // console.log('[V-WEBP]', el, binding, bindingValue)
  let srcValue;
  if (bindingValue) {
    let str = bindingValue;
    if (bindingValue === true) {
      if (type === 'src') {
        str = el.getAttribute('src');
      } else {
        console.error(
          '[WEBP] DoNot Support v-webp="true" with backgroundImage,please use param lik v-webp="img"'
        );
      }
    }
    if (typeof str === 'string') {
      srcValue = tryConvertWebPUrl(str);
    }
  }
  if (type === 'src') {
    el.setAttribute(type, srcValue);
    if (!srcValue) {
      el.removeAttribute(type);
    }
  } else if (type === 'bg') {
    if (srcValue) {
      el.style.backgroundImage = `url(${srcValue})`;
    } else {
      el.style.backgroundImage = '';
    }
  }
}
const directiveOptions: DirectiveOptions = {
  bind: update,
  update,
};

/**
 * @usage v-webp:src="./src/xx/zz.png?webp"
 * @usage v-webp:bg="./src/xx/zz.png?webp"   backgroundImage:url(xxx)
 * @usage v-webp="./src/xx/zz.png?webp"    img    webp,         backgroundImage
 * @usage v-webp="true" | v-webp   el src
 * @usage v-webp="false"
 * @usage :comp-prop="imgData | webp"
 */
export default function install() {
  Vue.directive('webp', directiveOptions);
  Vue.filter('webp', webpFilter);
}

/**
 * png        webp  .webp
 * @param value png
 * @returns
 */
export function webpFilter(value: string) {
  if (!value) return value;
  return tryConvertWebPUrl(value);
}
