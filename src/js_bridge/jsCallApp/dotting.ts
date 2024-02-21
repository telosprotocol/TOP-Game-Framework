import { callBridgePromise } from '../jsCallAppBaseUtils';

/**
 *   app
 */
export function dotting_bridge(
  eventName: string,
  params: { [key: string]: string | number },
  label?: string | number,
  value?: number | string
) {
  // console.log('dotting_bridge start')
  return callBridgePromise<boolean>(
    'dotting',
    {
      eventName: eventName,
      params: params,
      label: label || '',
      value: value || 0,
    },
    {}
    // {
    //   doLog: true,
    //   doLogStart: true,
    //   doLogStartDetail: true
    // }
  );
  // .then((rlt) => {
  //   // console.log('jsbridge dotting end. rlt=>', rlt, typeof rlt)
  //   //
  //   setLocalLog_bridge({
  //     eventName: eventName,
  //     params: params,
  //   });

  //   return rlt;
  // });
}

// /**
//  *   app
//  */
// export function dottingv_bridge(
//   eventName: string,
//   params: { [key: string]: string | number },
//   label?: string | number,
//   value?: number | string
// ) {
//   // console.log('dotting_bridge start')
//   return callBridgePromise<boolean>(
//     'dottingv',
//     {
//       eventName: eventName,
//       params: params,
//       label: label || '',
//       value: value || 0,
//     },
//     {}
//     // {
//     //   doLog: true,
//     //   doLogStart: true,
//     //   doLogStartDetail: true
//     // }
//   ).then((rlt) => {
//     return rlt;
//   });
// }

export function setLocalLog_bridge(_json: any) {
  // console.log('jsbridge setLocalLog rlt start:', _json)
  if (process.env.VUE_APP_ENV_SERVER === 'development') {
    if (_json.a) {
      console.log(_json.a, _json.b, _json.deviceId);
    }
  }
  return callBridgePromise<boolean>('setLocalLog', {
    data: JSON.stringify(_json),
  }).then((rlt) => {
    // console.log('jsbridge setLocalLog end. rlt=>', rlt, typeof rlt)
    return rlt;
  });
}
