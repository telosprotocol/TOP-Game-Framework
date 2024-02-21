import { callBridgePromise } from '../jsCallAppBaseUtils';

/**
 * Ip    （http://ip-api.com/json/）
 */
export interface IIpRegionModel {
  city: string;
  country: string;
  countryCode: string;
  isp: string;
  lat: number;
  lon: number;
  org: string;
  query: string;
  region: string;
  regionName: string;
  timezone: string;
  zip: string;
  status: string;
}

/**
 *   App      Ip   （2.8.4.0   ）
 */
export function getIpRegionBridge() {
  // console.log('dotting_bridge start')
  return callBridgePromise<IIpRegionModel>(
    'getIpRegion',
    {}
    // {
    //   doLog: true,
    //   doLogStart: true,
    //   doLogStartDetail: true
    // }
  );
}
