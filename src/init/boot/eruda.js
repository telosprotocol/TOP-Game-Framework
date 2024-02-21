if (
  /eruda=true/.test(window.location) ||
  'true' == localStorage.getItem('active-eruda')
) {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = !0;
  script.onload = function () {
    console.log('[Eruda] Injected');
    window.eruda.init({
      defaults: {
        displaySize: 50,
        transparency: 0.9,
      },
    });
    window.eruda.position({ x: 10, y: 50 });
  };
  script.src = './eruda.js';
  document.getElementsByTagName('head')[0].appendChild(script);
  if (window.location.href.indexOf('eruda=true-auto') > -1) {
    localStorage.setItem('active-eruda', 'true');
  } else if (window.location.href.indexOf('eruda=true-close') > -1) {
    localStorage.removeItem('active-eruda');
  }
}
