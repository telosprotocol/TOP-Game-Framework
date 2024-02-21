export function initQrCode(
  qrCodeEl: HTMLCanvasElement,
  qWidth: number,
  qText: string
) {
  // console.log('qrcode', qText, qWidth);
  return import('qrcode').then((QRCode) => {
    return QRCode.toCanvas(qrCodeEl, qText, {
      // errorCorrectionLevel: 'H',
      margin: 0,
      width: qWidth,
      // scale: 4,
      // scale: 1,
      // scale: 4,
      // width: qWidth,
    });
  });
}
