export function initCanvasUtils() {
  return import('html2canvas');
}
/**
 *   html2Canvas      , ：initCanvasUtils
 * @param element html2canvas   ref， ref.value
 * @param backgroundColor
 * @param imgName //        ，  Share-ABCD
 */
export async function saveHtml2CanvasImage(
  element: HTMLElement,
  options: { backgroundColor: string }
) {
  const scale = window.devicePixelRatio;
  const { clientWidth, clientHeight } = element;
  const html2canvas = (await initCanvasUtils()).default;
  return html2canvas(element, {
    scale,
    width: clientWidth,
    height: clientHeight,
    scrollX: 0,
    scrollY: 0,
    backgroundColor: options.backgroundColor,
  }).then((canvas) => {
    const base64Url = canvas.toDataURL('image/png');
    const byteCharacters = atob(base64Url.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    window.URL.revokeObjectURL(base64Url);
    return byteArray;
  });
}
