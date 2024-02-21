export function numberFloor(n: number, precision: number) {
  if (isNaN(n)) {
    return n;
  }
  return parseFloat(n.toFixed(precision));
}

export function uniqNumbers(...list: number[][]) {
  const check: Record<string, boolean> = {};
  const res: number[] = [];
  list.forEach((subList) => {
    if (subList) {
      subList.forEach((item) => {
        if (!check[item]) {
          check[item] = true;
          res.push(item);
        }
      });
    }
  });
  return res;
}
