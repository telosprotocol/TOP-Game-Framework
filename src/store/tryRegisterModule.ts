/**
 *
 * @param moduleName
 * @param module
 * @returns
 */
export function tryRegisterModule(moduleName: string, module: any) {
  const vue205 = window.vue205;
  if (!vue205.$ss.hasModule(moduleName)) {
    vue205.$ss.registerModule(moduleName, module);
    return true;
  }
  return false;
}
