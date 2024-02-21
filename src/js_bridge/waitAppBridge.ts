export function waitAppBridge(
  callback: (bridge: IWebViewJavascriptBridge) => void
) {
  if (window.WebViewJavascriptBridge) {
    return callback(window.WebViewJavascriptBridge);
  }
  // alert('  WebViewJavascriptBridge  ,  WebViewJavascriptBridgeReady    ')
  document.addEventListener(
    'WebViewJavascriptBridgeReady',
    function () {
      // alert('  WebViewJavascriptBridge  ')
      return callback(window.WebViewJavascriptBridge);
    },
    false
  );
}
