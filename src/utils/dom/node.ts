export function isTargetInWrapEl(
  target: HTMLElement,
  wrapEl: HTMLElement
): boolean {
  if (!wrapEl || !target) {
    return false;
  }
  if (target === wrapEl) {
    return true;
  }
  const parentElement = target.parentElement;
  if (parentElement == null) {
    return false;
  }
  return isTargetInWrapEl(parentElement, wrapEl);
}
