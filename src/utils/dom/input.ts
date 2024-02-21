/**
 *   input   render bug
 * @param vm
 * @param data
 */
export function checkAndForceUpdate(
  vm: Vue,
  data: {
    preValue: string;
    newValue: string;
    inputValue: string;
  }
) {
  const { preValue, newValue, inputValue } = data;
  const forceRender = preValue === newValue && newValue !== inputValue;
  if (forceRender) {
    vm.$forceUpdate();
  }
}
