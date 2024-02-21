export function longNumberStrFormat(str: string) {
  //    long        String。
  //14             string
  const reg = /"\w+":\s*\d{16,}/g;
  const newStr = str.replace(reg, function (a) {
    return a.replace(/: */g, ':"').replace(' ', '') + '"';
  });
  return newStr;
}
