export function storeTypeMap<T extends Record<string, string>>(
  moduleName: string,
  typeMap: T
) {
  const res: Partial<T> = {};
  Object.keys(typeMap).forEach((fieldKey: keyof T) => {
    (res as any)[fieldKey] = `${moduleName}/${typeMap[fieldKey]}`;
  });
  return res as T;
}

//

export function storeDispatch<R>(type: string, payload?: any) {
  const $ss = window.$ss;
  // if (!vue205) {
  //   return Promise.resolve(true).then(() => {
  //     return storeDispatch<R>(type, payload);
  //   })
  // }
  return $ss.dispatch(type, payload) as Promise<R>;
}
export function storeCommit(type: string, payload?: any) {
  const $ss = window.$ss;
  return $ss.commit(type, payload);
}
export function getStore() {
  const $ss = window.$ss;
  return $ss;
}
