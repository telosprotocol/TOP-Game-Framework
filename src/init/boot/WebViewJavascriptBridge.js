//notation: js file can only use this kind of comments
//since comments will cause error when use in webview.loadurl,
//comments will be remove by java use regexp
(function () {
  if (window.GC && window.GC.isInApp === false) {
    return;
  }
  const version = 4;
  if (window.WebViewJavascriptBridge) {
    //     ，
    const oldVersion = window.WebViewJavascriptBridge.version || 0;
    if (version > oldVersion) {
      delete window.WebViewJavascriptBridge;
      console.log('[Bridge] overide old bridge!!');
    } else {
      return; //
    }
  }
  const doc = document;
  let messagingIframe;
  let bizMessagingIframe;
  const WebViewJavascriptBridge = createBridge();
  window.WebViewJavascriptBridge = WebViewJavascriptBridge;

  function createBridge() {
    let sendMessageQueue = [];
    let receiveMessageQueue = [];
    const messageHandlers = {};

    const CUSTOM_PROTOCOL_SCHEME = 'yy';
    const QUEUE_HAS_MESSAGE = '__QUEUE_MESSAGE__/';

    const responseCallbacks = {};
    let uniqueId = 1;
    // hasCallback from app
    let hasCallbacked = false;
    let isLogFromNative = false;
    let isLogSend = false;

    //#region ready
    let readyCallbackList = [];
    let doFetchQueryWhenIsReady = false;
    function getReady(cb) {
      if (readyCallbackList) {
        readyCallbackList.push(cb);
      } else {
        cb && cb();
      }
    }
    function readyCallback() {
      if (readyCallbackList) {
        for (let i = 0; i < readyCallbackList.length; i++) {
          const item = readyCallbackList[i];
          try {
            item && item();
          } catch (e) {}
        }
        readyCallbackList = null;
        if (sendMessageQueue.length > 0) {
          _notifyNative();
        }
        if (doFetchQueryWhenIsReady) {
          _fetchQueue();
        }
      }
    }
    //#endregion

    // set default messageHandler (of message thread)
    function init(messageHandler) {
      if (WebViewJavascriptBridge._messageHandler) {
        throw new Error('WebViewJavascriptBridge.init called twice');
      }
      WebViewJavascriptBridge._messageHandler = messageHandler;
      const receivedMessages = receiveMessageQueue;
      receiveMessageQueue = null;
      for (let i = 0; i < receivedMessages.length; i++) {
        _dispatchMessageFromNative(receivedMessages[i]);
      }
    }

    // send
    function send(data, responseCallback) {
      _doSend(
        {
          data: data,
        },
        responseCallback
      );
    }

    // regist thread, input value to array
    function registerHandler(handlerName, handler) {
      messageHandlers[handlerName] = handler;
    }
    // call thread
    function callHandler(handlerName, data, responseCallback) {
      if (isLogSend) {
        console.log('[Bridge] Js2App', handlerName, data);
      }
      _doSend(
        {
          handlerName: handlerName,
          data: data,
        },
        responseCallback
      );
    }

    //sendMessage add message, trigger native invoke   sendMessage
    function _doSend(message, responseCallback) {
      if (responseCallback) {
        const callbackId = 'cb_' + uniqueId++ + '_' + new Date().getTime();
        responseCallbacks[callbackId] = responseCallback;
        message.callbackId = callbackId;
      }

      sendMessageQueue.push(message);
      if (messagingIframe) {
        _notifyNative();
      }
    }

    function _notifyNative() {
      messagingIframe.src = CUSTOM_PROTOCOL_SCHEME + '://' + QUEUE_HAS_MESSAGE;
    }

    // provide to native
    // This functions is: return to native with 'sendMessageQueue'.
    // Because we can't get return value from android function.
    // So we get 'return value' by by 'url shouldOverrideUrlLoading'
    function _fetchQueue() {
      if (bizMessagingIframe) {
        const messageQueueString = JSON.stringify(sendMessageQueue);
        sendMessageQueue = [];
        //android can't read directly the return data, so we can reload iframe src to communicate with java
        if (messageQueueString !== '[]') {
          bizMessagingIframe.src =
            CUSTOM_PROTOCOL_SCHEME +
            '://return/_fetchQueue/' +
            encodeURIComponent(messageQueueString);
        }
      } else {
        doFetchQueryWhenIsReady = true;
      }
    }

    // provide for native
    function _dispatchMessageFromNative(messageJSON) {
      Promise.resolve(true).then(function () {
        let message;
        try {
          message = JSON.parse(messageJSON);
        } catch (ex) {
          (
            console.error || console.log
          )('[Bridge] jsonParseError:', messageJSON, ex);
          return;
        }
        let responseCallback;
        //java call finished, now need to call js callback function
        if (message.responseId) {
          responseCallback = responseCallbacks[message.responseId];
          if (!responseCallback) {
            return;
          }
          responseCallback(message.responseData);
          delete responseCallbacks[message.responseId];
        } else {
          //send directly
          if (message.callbackId) {
            const callbackResponseId = message.callbackId;
            responseCallback = function (responseData) {
              _doSend({
                responseId: callbackResponseId,
                responseData: responseData,
              });
            };
          }

          const defaultHandler = WebViewJavascriptBridge._messageHandler;
          let handler;
          if (message.handlerName) {
            // push messages
            handler = messageHandlers[message.handlerName];
          }
          //find the handler
          try {
            if (handler) {
              handler(message.data, responseCallback);
            } else {
              defaultHandler(message, responseCallback);
            }
          } catch (exception) {
            if (typeof console != 'undefined') {
              console.log(
                'WebViewJavascriptBridge: WARNING: javascript handler threw.',
                message,
                exception
              );
            }
          }
        }
      });
    }

    // provide for native,
    // receiveMessageQueue will be assigned with null after page loaded
    function _handleMessageFromNative(messageJSON) {
      // console.log(messageJSON)
      if (isLogFromNative) {
        console.log('[Bridge] App2Js', messageJSON);
      }
      hasCallbacked = true;
      if (receiveMessageQueue) {
        receiveMessageQueue.push(messageJSON);
      }
      _dispatchMessageFromNative(messageJSON);
    }

    const WebViewJavascriptBridge = {
      getReady: getReady,
      __readyCallback: readyCallback,
      version: version,
      init: init,
      send: send,
      registerHandler: registerHandler,
      callHandler: callHandler,
      isCalledByApp: function () {
        return hasCallbacked;
      },
      openDebug: function (openSend, openFromNative) {
        isLogSend = !!openSend;
        isLogFromNative = !!openFromNative;
      },
      _fetchQueue: _fetchQueue,
      _handleMessageFromNative: _handleMessageFromNative,
    };

    try {
      const ls = localStorage;
      if (ls) {
        const debugInfo = ls.getItem('__WVBRIDGE_DEBUG_');
        if (debugInfo) {
          WebViewJavascriptBridge.openDebug(
            debugInfo.indexOf('send') > -1,
            debugInfo.indexOf('push') > -1
          );
        }
      }
    } catch (ex) {}
    return WebViewJavascriptBridge;
  }
  function tryInitBridge() {
    if (!doc.documentElement) {
      return false;
    }
    if (messagingIframe) {
      return true; //    iframe
    }
    // create message queue (index queue)
    function _createQueueReadyIframe(doc) {
      messagingIframe = doc.createElement('iframe');
      messagingIframe.style.display = 'none';
      doc.documentElement.appendChild(messagingIframe);
    }
    // create messages queue
    function _createQueueReadyIframe4biz(doc) {
      bizMessagingIframe = doc.createElement('iframe');
      bizMessagingIframe.style.display = 'none';
      doc.documentElement.appendChild(bizMessagingIframe);
    }
    _createQueueReadyIframe(doc);
    _createQueueReadyIframe4biz(doc);
    const readyEvent = doc.createEvent('Events');
    readyEvent.initEvent('WebViewJavascriptBridgeReady');
    readyEvent.bridge = WebViewJavascriptBridge;
    doc.dispatchEvent(readyEvent);
    console.log('[Bridge] Inited');
    WebViewJavascriptBridge.__readyCallback();
    return true;
  }

  let initTimer;
  function clearCheckTimer() {
    if (initTimer != null) {
      clearTimeout(initTimer);
    }
  }
  function startCheckTimer() {
    clearCheckTimer();
    if (window.WebViewJavascriptBridge) {
      return;
    }
    initTimer = setTimeout(function () {
      console.log('[BridgeInit] InitedByTimer docEl =' + !!doc.documentElement);
      if (false === tryInitBridge()) {
        startCheckTimer();
      }
    }, 500);
  }
  if (false === tryInitBridge()) {
    console.log('[Bridge] InitError docEl =' + !!doc.documentElement);
    docReady(function () {
      console.log('[Bridge] InitedByReady docEl =' + !!doc.documentElement);
      tryInitBridge();
    });
    startCheckTimer();
  }
  function docReady(callback) {
    doc.addEventListener(
      'DOMContentLoaded',
      function () {
        callback();
        doc.removeEventListener('DOMContentLoaded', arguments.callee, false);
      },
      false
    );
  }
})();
