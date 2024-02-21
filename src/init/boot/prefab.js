/**
 *     ：dom   ，  js
 * @param {*} isDialog
 * @returns
 */
(function () {
  function flexibleBoot(isDialog) {
    const win = window;
    const doc = win.document;
    const docEl = doc.documentElement;
    // const BASEREMPX = 16; //1rem=16px
    let rootFontSize = 16;
    // 1. set meta and data-dpr
    let metaEl = doc.querySelector('meta[name="viewport"]');
    const scale = 1,
      dpr = 1; //    1
    docEl.setAttribute('data-dpr', dpr + '');
    if (!metaEl) {
      metaEl = doc.createElement('meta');
      metaEl.setAttribute('name', 'viewport');
      metaEl.setAttribute(
        'content',
        'initial-scale=' +
          scale +
          ', maximum-scale=' +
          scale +
          ', minimum-scale=' +
          scale +
          ', user-scalable=no, viewport-fit=cover'
      );
      if (docEl.firstElementChild) {
        docEl.firstElementChild.appendChild(metaEl);
      } else {
        const wrap = doc.createElement('div');
        wrap.appendChild(metaEl);
        doc.write(wrap.innerHTML);
      }
    }

    // 1.1 Utils

    //#region

    let listenHandlers = [];
    /**
     *   fontsize
     * @param {(fontSize:number)=>void} handler
     */
    function addFontSizeChangedListener(handler) {
      listenHandlers.push(handler);
    }
    /**
     *
     * @param {*} handler
     */
    function removeFontSizeChangedListener(handler) {
      if (handler) {
        for (let i = listenHandlers.length - 1; i >= 0; i--) {
          if (listenHandlers[i] === handler) {
            listenHandlers.splice(i, 1);
          }
        }
      } else {
        // remove all
        listenHandlers = [];
      }
    }
    //#endregion

    //#region   fontSize
    const FontTag = '[Font]';

    /**
     *   fontSize
     * @param {Number} toFontSize
     * @param {String} from
     */
    function setFontSize(toFontSize, from) {
      rootFontSize = toFontSize;
      docEl.style.fontSize = toFontSize.toFixed(7) + 'px';
      console.log(FontTag, toFontSize, from);
      //
      if (listenHandlers.length > 0) {
        listenHandlers.forEach((itemHandler) => {
          if (itemHandler) {
            itemHandler(toFontSize);
          }
        });
      }
      setTimeout(() => {
        docEl.style.fontSize = rootFontSize.toFixed(7) + 'px';
      }, 10);
    }

    //#endregion
    const mql = window.matchMedia
      ? window.matchMedia('(orientation: landscape)')
      : { matches: false };
    //2.init font size
    let isRefreshByDocmentElementInited = false;
    /**
     *   rem(    )
     * @param {String} from
     * @returns
     */
    function refreshRem(from) {
      const w = Math.min(window.screen.width, window.screen.height);
      const docElBounding = docEl.getBoundingClientRect();
      let width = isDialog
        ? w
        : mql.matches
        ? docElBounding.height < 100
          ? docElBounding.width
          : docElBounding.height
        : docElBounding.width;
      if (!width) {
        return;
      }
      isRefreshByDocmentElementInited = true;
      if (width / dpr > 540) {
        width = 540 * dpr; //width * dpr
      }
      const rem = width / 22.5; //-->16px=1rem designWidth
      setFontSize(rem, from);
    }

    (function startListening() {
      let tid;
      const RefreshRemNextTickMs = 30;
      win.addEventListener(
        'resize',
        function () {
          if (!isRefreshByDocmentElementInited) {
            //      ，
            refreshRem('resize');
          }
          clearTimeout(tid);
          tid = setTimeout(refreshRem, RefreshRemNextTickMs);
        },
        false
      );
      win.addEventListener(
        'pageshow',
        function (e) {
          // console.log('[pageshow]', e.persisted)
          if (e.persisted) {
            clearTimeout(tid);
            tid = setTimeout(refreshRem, RefreshRemNextTickMs);
          }
        },
        false
      );
    })();

    if (doc.readyState === 'complete') {
      doc.body.style.fontSize = 12 * dpr + 'px';
      document.documentElement.style.fontSize = rootFontSize + 'px';
      console.log(FontTag, 'doc complete');
    } else {
      doc.addEventListener(
        'DOMContentLoaded',
        function () {
          doc.body.style.fontSize = 12 * dpr + 'px';
          document.documentElement.style.fontSize = rootFontSize + 'px';
          console.log(FontTag, 'init DOMContentLoaded');
        },
        false
      );
    }
    refreshRem('boot');
    return {
      getRootFontSize: function () {
        return rootFontSize;
      },
      addFontSizeChangedListener: addFontSizeChangedListener,
      removeFontSizeChangedListener: removeFontSizeChangedListener,
    };
  }
  //     ,   lottie
  const flexible = flexibleBoot(window.GC && window.GC.isDialog);

  const PREFAB = {
    flexible: flexible,
  };
  window.PREFAB = PREFAB;
})();
