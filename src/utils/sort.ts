export function stableSort<T>(array: T[], compareFn: (a: T, b: T) => number) {
  return array
    .map((v: T, idx: number) => {
      return [idx, v] as [number, T];
    })
    .sort(function (a, b) {
      return compareFn(a[1], b[1]) || a[0] - b[0];
    })
    .map((c) => c[1]);
}

export function randomSort<T>(list: T[]) {
  if (!list) {
    return list;
  }
  return list
    .map((item) => {
      return {
        info: item,
        sortNo: Math.floor(Math.random() * 10000),
      };
    })
    .sort((a, b) => {
      return a.sortNo - b.sortNo;
    })
    .map((item) => {
      return item.info;
    });
}
