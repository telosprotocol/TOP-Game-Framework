export type IRgbColor = {
  r: number;
  g: number;
  b: number;
};

type IHslColor = {
  h: number;
  s: number;
  l: number;
};
/**
 * hex to Rgb
 * @param hex #aabbcc
 * @returns [r,g,b]
 */
export function hexToRgb(hex: string) {
  const rgb = [1, 3, 5].map((item) => {
    return hex.substr(item, 2);
  });
  const rgbList = rgb.map((item) => {
    return parseInt(item, 16);
  });
  return {
    r: rgbList[0],
    g: rgbList[1],
    b: rgbList[2],
  } as IRgbColor;
}
export function rgbToHex(color: IRgbColor) {
  function hex(x: number) {
    return ('0' + x.toString(16)).slice(-2);
  }
  const _hex = '#' + hex(color.r) + hex(color.g) + hex(color.b);
  return _hex.toUpperCase();
}
export function hsl2String(hsl: IHslColor) {
  return `hsl(${hsl.h},${numberFixed(100 * hsl.s)}%,${numberFixed(
    100 * hsl.l
  )}%)`;
}
//#region rgb 2 hsl

/**
 * rgb   hsl
 * @param {IRgbColor} [0,255]
 * @param {Boolean} stringMode
 */
export function rgb2hsl(color: IRgbColor) {
  const { r: R, g: G, b: B } = color;
  const _R = R / 255;
  const _G = G / 255;
  const _B = B / 255;
  const Cmax = Math.max(_R, _G, _B);
  const Cmin = Math.min(_R, _G, _B);
  const V = Cmax - Cmin;

  let H = 0;
  if (V === 0) {
    H = 0;
  } else if (Cmax === _R) {
    H = 60 * (((_G - _B) / V) % 6);
  } else if (Cmax === _G) {
    H = 60 * ((_B - _R) / V + 2);
  } else if (Cmax === _B) {
    H = 60 * ((_R - _G) / V + 4);
  }

  H = Math.floor(backCycle(H, 360));
  const L = numberFixed((Cmax + Cmin) / 2);
  const S = V === 0 ? 0 : numberFixed(V / (1 - Math.abs(2 * L - 1)));

  // if (stringMode) {
  //   return `hsl(${H},${numberFixed(100 * S)}%,${numberFixed(100 * L)}%)`;
  // }

  return { h: H, s: S, l: L };
}
// utils
function backCycle(num: number, cycle: number) {
  let index = num % cycle;
  if (index < 0) {
    index += cycle;
  }
  return index;
}
function numberFixed(num = 0, count = 3) {
  const power = Math.pow(10, count);
  return Math.floor(num * power) / power;
}
//#endregion

//#region hsl2rgb
/**
 * HSL      RGB.
 *         http://en.wikipedia.org/wiki/HSL_color_space.
 * h, s,   l     [0, 1]
 *     r, g,   b   [0, 255]
 *
 * @param {IHslColor} color
 * @return  {r,g,b}  RGB
 */
export function hsl2rgb(color: IHslColor) {
  const { h, s, l } = color;
  let r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const h2 = h / 360;
    r = hue2rgb(p, q, h2 + 1 / 3);
    g = hue2rgb(p, q, h2);
    b = hue2rgb(p, q, h2 - 1 / 3);
  }
  function hue2rgb(p: number, q: number, _t: number) {
    let t = _t;
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

//#endregion
