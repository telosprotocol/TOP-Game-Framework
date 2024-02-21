const h5_call_app = {};
h5_call_app.browserInfo = function () {
  const json = {
    userAgent: navigator.userAgent.toLowerCase(),
    isAndroid: Boolean(navigator.userAgent.match(/android/gi)),
    isIos: Boolean(navigator.userAgent.match(/iphone|ipod|ipad/gi)),
    isWeChat: Boolean(navigator.userAgent.match(/MicroMessenger/gi)),
    isQQ: Boolean(navigator.userAgent.match(/ QQ/gi)),
    isQQBrowser: Boolean(navigator.userAgent.match(/MQQBrowser/gi)),
  };

  return json;
};

const preventDefault = function (e) {
  e = e || window.event;
  if (e.preventDefault) {
    e.preventDefault();
  } else {
    e.returnValue = false;
  }
};

//   APP
h5_call_app.openApp = function (
  weChatShowCb,
  downLoadElem,
  {
    androidScheme, //     app androidSchema
    iosScheme, //     app iosSchema
    androidUniversalLink, // android    (   UniversalLink          )
    iosUniversalLink, // ios    (   UniversalLink          )
  }
) {
  const browser = h5_call_app.browserInfo();
  let iosVersion = browser.userAgent.match(/os\s*(\d+)/);

  iosVersion = iosVersion ? iosVersion[1] || 0 : 0;

  downLoadElem.addEventListener('click', function () {
    preventDefault();

    //
    if (browser.isWeChat) {
      weChatShowCb();
    } else {
      if (browser.isAndroid) {
        const ifr = document.createElement('iframe');
        ifr.src = androidScheme;

        ifr.style.display = 'none';
        document.body.appendChild(ifr);

        setTimeout(function () {
          document.body.removeChild(ifr);
        }, 5);
      } else {
        // ios9+
        if (iosVersion >= 9) {
          document.location.href = iosUniversalLink;
        } else {
          setTimeout(function () {
            //      settimeout
            const a = document.createElement('a'); //  a
            a.setAttribute('href', iosScheme),
              (a.style.display = 'none'),
              document.body.appendChild(a);
            const t = document.createEvent('HTMLEvents'); //        Event   ，       。
            t.initEvent('click', !1, !1); //
            a.dispatchEvent(t); //
          }, 0);
        }
      }

      const checkOpen = function (cb) {
        const _clickTime = +new Date();

        function check(elsTime) {
          if (elsTime > 3000 || document.hidden || document.webkitHidden) {
            cb(1);
          } else {
            cb(0);
          }
        }
        //    20ms      ，             3000ms，
        let _count = 0;
        const intHandle = setInterval(function () {
          _count++;
          const elsTime = +new Date() - _clickTime;
          if (_count >= 100 || elsTime > 3000) {
            clearInterval(intHandle);
            check(elsTime);
          }
        }, 20);
      };
      checkOpen(function (opened) {
        // APP
        if (opened === 0) {
          const browserInfo = h5_call_app.browserInfo();
          if (browserInfo.isAndroid) {
            //        a  ,   download,      ;
            // location.href = androidUniversalLink
            document.getElementById('dlIframe').contentWindow.onload =
              function () {};
            document.getElementById('dlIframe').src = androidUniversalLink;

            // window.open(androidUniversalLink)
            // document.querySelector('.download-page > .content').removeChild(document.querySelector('#dlIframe'))
          } else {
            // location.href = iosUniversalLink
            document.getElementById('dlIframe').contentWindow.onload =
              function () {};
            document.getElementById('dlIframe').src = iosUniversalLink;
            // window.open(iosUniversalLink)
            // document.querySelector('.download-page > .content').removeChild(document.querySelector('#dlIframe'))
          }
        } else {
        }
      });
    }
    // h5_call_app.trackEventDownload();
  });
};

export default h5_call_app;
