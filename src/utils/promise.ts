import type { CancelToken } from 'axios';
/**
 *
 *  :     1+RETRY_COUNT
 */
const RETRY_COUNT = 2;
const TIMEOUT = 5000;

const TIMEOUT_ERROR = {
  Result: 0,
  Reason: 'promise timeout',
};

type IAnyArgs = any[];
interface IPromiseFactory<T extends IAnyArgs, R> {
  (...args: T): Promise<R>;
}
/**
 *   promisify
 * ( :timeout 0 ，   )
 * @param {number} timeout ms
 * @param {(...IPromiseFactoryArg)=>Promise<any>} promiseFactory
 * @param {IPromiseFactoryArg[]} args promiseFactory
 */
export function timeoutWrap<T extends IAnyArgs, R>(
  timeout: number,
  promiseFactory: IPromiseFactory<T, R>,
  args?: T
) {
  const p2 = timeoutEnhance<T, R>(timeout, promiseFactory);
  return p2(...args);
}

export function timeoutEnhance<T extends IAnyArgs, R>(
  timeout: number,
  promiseFactory: IPromiseFactory<T, R>
) {
  if (timeout === 0) {
    return promiseFactory;
  }
  return function (...args: T) {
    const p = promiseFactory(...args);
    let resolveFunc: (v: any) => void, rejectFunc: (err: any) => void;
    const timer = setTimeout(function () {
      rejectFunc(TIMEOUT_ERROR);
    }, timeout || TIMEOUT);
    p.then(
      (res) => {
        resolveFunc(res);
      },
      (err) => {
        rejectFunc(err);
      }
    ).finally(() => {
      if (timer) {
        clearTimeout(timer);
      }
    });
    return new Promise((resolve, reject) => {
      resolveFunc = resolve;
      rejectFunc = reject;
    }) as Promise<R>;
  };
}
export interface IRetryOption {
  retryCount?: number;
  timeout?: number;
  onlyRetryTimeout?: boolean;
}
/**
 *   Wrap
 * @param {IRetryOption} option(    3 ，    1s)
 * @param {(...IPromiseFactoryArg)=>Promise<any>} promiseFactory?
 * @param {IPromiseFactoryArg[]} args? promiseFactory
 * @param {number} _curIdx       ，  0
 */
function _retryWrap<T extends IAnyArgs, R>(
  option: IRetryOption,
  promiseFactory: IPromiseFactory<T, R>,
  args: T,
  _curIdx = 0
): Promise<R> {
  option = option || {};
  const p = timeoutWrap(option.timeout, promiseFactory, args);
  if (option.retryCount === 0) {
    return p;
  }
  const res = p.then(
    (res) => {
      return res;
    },
    (err) => {
      let needRetry = false;
      const retryCount = option.retryCount || RETRY_COUNT;
      if (retryCount > _curIdx) {
        //
        if (
          (option.onlyRetryTimeout && err === TIMEOUT_ERROR) ||
          !option.onlyRetryTimeout
        ) {
          needRetry = true;
        }
      }
      if (needRetry) {
        console.log('[Retry]', _curIdx + 1, promiseFactory.name);
        return _retryWrap(option, promiseFactory, args, _curIdx + 1);
      } else {
        throw err;
      }
    }
  );
  return res;
}

/**
 *
 * @param option
 * @param promiseFactory     ，
 * @param args
 * @returns
 */
export function retryWrap<T extends IAnyArgs, R>(
  option: IRetryOption,
  promiseFactory: IPromiseFactory<T, R>,
  args?: T
) {
  return _retryWrap(option, promiseFactory, args || ([] as T), 0);
}

export function catchRetryEx(ex: any): { Result: 0; Reason?: string } {
  if (ex.Result) {
    return ex as { Result: 0; Reason?: string };
  } else {
    return {
      Result: 0,
      Reason: ex?.toString(),
    };
  }
}
/**
 *   Enhance
 * @param option
 * @param promiseFactory     ，
 * @returns
 */
export function retryEnhance<T extends IAnyArgs, R>(
  option: IRetryOption,
  promiseFactory: IPromiseFactory<T, R>
) {
  return function (...args: T) {
    return retryWrap(option, promiseFactory, args);
  };
}

// const cancel=CancelToken.source();
// cancel.cancel();
// cancel.token;

// let cancel;
// const token=new CancelToken((c)=>{
//   cancel=c;
// })

/**
 *     ，
 * @param options
 * @param promiseFactory
 */
export function retryUtilSuccess<T extends IAnyArgs, R>(
  options: {
    cancelToken?: CancelToken;
    timeout?: number;

    //     ，    3,3,30
    multiplier?: number;
    initialBackOff?: number;
    maxBackOff?: number;
  },
  promiseFactory: IPromiseFactory<T, R>
) {
  return function (...args: T) {
    options = options || {
      multiplier: 3,
      initialBackOff: 3,
      maxBackOff: 30,
    };
    const multiplier = options.multiplier || 3;
    const initialBackOff = options.initialBackOff || 3;
    const maxBackOff = options.maxBackOff || 30;

    let pFactory2 = promiseFactory;
    if (options.timeout > 0) {
      pFactory2 = timeoutEnhance(options.timeout, promiseFactory);
    }
    let dealCount = 0;
    let curBackOff = initialBackOff;
    doPromise();
    let timer: number;
    function doPromise() {
      if (timer) {
        clearTimeout(timer);
      }
      dealCount++;
      return pFactory2(...args).catch((ex) => {
        if (options.cancelToken) {
          options.cancelToken.throwIfRequested();
        }
        console.log('[Retry]', dealCount, promiseFactory.name, ex);

        // retry
        timer = setTimeout(() => {
          doPromise();
        }, curBackOff * 1000);
        curBackOff *= multiplier;
        if (curBackOff > maxBackOff) {
          curBackOff = maxBackOff;
        }
      });
    }
  };
}

// export function errorSwallow<T>(p: Promise<T>) {
//   p.catch(noop);
//   return p;
// }
