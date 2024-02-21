import { hexToRgb } from '@/utils/color';

export default class TheSvgController {
  private $el: HTMLDivElement;

  static _ins: TheSvgController;
  static get Instance() {
    if (!TheSvgController._ins) {
      TheSvgController._ins = new TheSvgController();
    }
    return TheSvgController._ins;
  }

  private constructor() {
    const el = document.createElement('div');
    el.setAttribute('role', 'svg-define');
    this.$el = el;
    document.body.append(el);
  }

  private map: Record<string, boolean> = {};

  private getHueChangeColorId(color: string) {
    const id = 'changeHue_' + color.substr(1);
    return id;
  }

  //#region  hueChange

  /**
   * @param color
   * @returns
   */
  getHueChangeColorFilter(color: string) {
    this.tryRegiterHueChangeColor(color);
    return `url(#${this.getHueChangeColorId(color)})`;
  }

  getHueChangeColorFilterStyle(color: string) {
    const filterValue = this.getHueChangeColorFilter(color);
    return {
      webkitFilter: filterValue,
      filter: filterValue,
    };
  }

  private tryRegiterHueChangeColor(color: string) {
    const id = this.getHueChangeColorId(color);
    if (this.map[id]) {
      return; //
    }
    this.map[id] = true;
    const rgb = hexToRgb(color);
    function getHueRatio(item: number) {
      return (item / 255).toFixed(3).substr(1);
    }
    const svgNs = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNs, 'svg');
    // svg.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#circle_");

    svg.setAttribute('xmlns', svgNs);
    svg.setAttribute('height', '0');
    // svg.append(defs)
    svg.innerHTML = `<defs>
    <filter
      id="${id}"
      color-interpolation-filters="sRGB"
    >
      <feColorMatrix
        type="matrix"
        values="0 0 0 0 ${getHueRatio(rgb.r)}
        0 0 0 0 ${getHueRatio(rgb.g)}
        0 0 0 0 ${getHueRatio(rgb.b)}
        0 0 0 1 0"
      />
    </filter>
  </defs>`;
    this.$el.append(svg);
    return;
  }

  //#endregion
}
