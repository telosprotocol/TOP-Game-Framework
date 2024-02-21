// from vant

type ScrollElement = HTMLElement | Window;
// get nearest scroll element
// http://stackoverflow.com/questions/17016740/onscroll-function-is-not-working-for-chrome
const overflowScrollReg = /scroll|auto/i;
export function getScroller(el: HTMLElement, root: ScrollElement = window) {
  let node = el;

  while (
    node &&
    node.tagName !== 'HTML' &&
    node.nodeType === 1 &&
    node !== root
  ) {
    const { overflowY } = window.getComputedStyle(node);

    if (overflowScrollReg.test(overflowY)) {
      if (node.tagName !== 'BODY') {
        return node;
      }

      // see: https://github.com/youzan/vant/issues/3823
      const { overflowY: htmlOverflowY } = window.getComputedStyle(
        node.parentNode as Element
      );

      if (overflowScrollReg.test(htmlOverflowY)) {
        return node;
      }
    }
    node = node.parentNode as HTMLElement;
  }

  return root;
}
export function getScrollTop(element: ScrollElement) {
  return 'scrollTop' in element ? element.scrollTop : element.pageYOffset;
}
