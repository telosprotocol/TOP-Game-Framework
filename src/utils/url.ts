export function convert2QueryStr(
  query: Record<string, null | string | number | undefined>
) {
  const list: string[] = [];
  Object.keys(query).forEach((key) => {
    const v = query[key];
    if (!key) {
      return;
    }
    if (v == null || v == '') {
      return;
    } else {
      list.push(`${key}=${encodeURIComponent(v + '')}`);
    }
  });
  return list.join('&');
}
