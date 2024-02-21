export function loadJsonAsync(url: string) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('GET', url);
    request.responseType = 'text';
    request.onload = function () {
      console.log('[PREFAB]', url, 'loaded');
      const txt = request.response;
      resolve(JSON.parse(txt));
    };
    request.timeout = 5000;
    request.send();
    request.onerror = function () {
      reject('Error');
    };
    request.ontimeout = function () {
      reject('Timeout');
    };
  });
}
