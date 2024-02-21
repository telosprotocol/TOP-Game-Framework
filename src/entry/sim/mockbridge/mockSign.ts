import encodeMd5 from 'js-md5';
import { trim } from 'lodash-es';
import random from 'string-random';

export const USER_MOCK_DEVICEINFO = {
  deviceId: '',
  userId: '',
};
export function createSignForSim(
  params: Record<string, string | number | undefined | null>
) {
  const nonceStr = random(32);
  const timestamp = `${new Date().getTime()}`;
  const timestampNum = Number(timestamp);
  const kvStore = {
    ...params,
    nonceStr,
    timestamp,
  };
  let paramKeys = Object.keys(kvStore).sort();

  if (timestampNum % 2 === 0) {
    paramKeys = paramKeys.reverse();
  }
  const kvStrList = [];

  const timestampV = (function convertTimeStamp(ts: number) {
    const ip2 = ts.toString(2);
    const ipr32 = ip2.substr(0, ip2.length - 32);
    function bitXor(bitStr1: string, bitStr2: string) {
      const bitResult = [];
      let no = 1;
      const bit1Len = bitStr1.length;
      const bit2Len = bitStr2.length;
      do {
        const char1Idx = bit1Len - no;
        const char2Idx = bit2Len - no;
        const char1 = char1Idx >= 0 ? bitStr1[char1Idx] : '0';
        const char2 = char2Idx >= 0 ? bitStr2[char2Idx] : '0';
        bitResult.push(char1 === char2 ? 0 : 1);
        if (char1Idx < 0 && char2Idx < 0) {
          break;
        }
        no++;
        // eslint-disable-next-line no-constant-condition
      } while (true);
      return parseInt(bitResult.reverse().join(''), 2);
    }
    // eslint-disable-next-line no-bitwise
    return bitXor(ip2, ipr32);
  })(timestampNum);
  paramKeys.forEach((item) => {
    let v = kvStore[item as keyof typeof kvStore] as string | number;
    if (v == null) {
      return;
    }
    if (typeof v !== 'string') {
      v = v + '';
    }
    v = trim(v);
    if (item === 'sign') {
      return;
    }
    if (v) {
      if (item === 'timestamp') {
        v = timestampV;
      }
      kvStrList.push(`${item}=${v}`);
    }
  });
  kvStrList.push('key=x4hypbqp0is0du4d');
  const stringA = kvStrList.join('&');
  const sign = encodeMd5(stringA).toUpperCase();
  return {
    nonceStr,
    timestamp,
    sign,
  };
}
