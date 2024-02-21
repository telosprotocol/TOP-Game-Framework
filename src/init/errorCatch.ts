import { tryTraceEvent } from '@/utils/trace';
const unhandledErrorMessages: { [msg: string]: boolean } = {};

export function initErrorCatch() {
  window.onerror = function (msg, url, line, opt_columnNumber, opt_error) {
    let err;
    if (opt_error) {
      err = opt_error;
    } else {
      err = new Error();
      (err as any).message = msg;
      (err as any).fileName = url;
      (err as any).lineNumber = line;
      if (!isNaN(opt_columnNumber)) {
        (err as any)['columnNumber'] = opt_columnNumber;
      }
    }
    const message = String(err.message);
    if (!err.message || message in unhandledErrorMessages) {
      console.log('[UnhandleError] ignore', err);
      return false;
    }
    console.log('[UnhandleError]', err);
    unhandledErrorMessages[message] = true;

    const data = {
      url: location.href,
      msg: message,
      type: 'UnhandledWindow:' + err.name,
      file: (err as any).fileName,
      line: (err as any).lineNumber,
      stack: (err.stack || '').substr(0, 500),
    };
    tryTraceEvent('error_uncatched', data);
    return false;
  };
  window.onunhandledrejection = function (e) {
    let errorMsg = '';
    let errorStack = '';
    if (typeof e.reason === 'object') {
      errorMsg = e.reason.message;
      errorStack = e.reason.stack;
    } else {
      errorMsg = e.reason;
      errorStack = '';
    }
    if (!errorMsg || errorMsg in unhandledErrorMessages) {
      console.log('[UnhandleError2] ignore', errorMsg);
      return;
    }
    console.log('[UnhandleError]', e);
    unhandledErrorMessages[errorMsg] = true;
    //
    const data = {
      url: location.href,
      msg: errorMsg,
      type: 'unhandleRejection:' + errorMsg,
      stack: (errorStack || '').substr(0, 500),
    };
    tryTraceEvent('error_unhandle', data);
  };
}
