const DATA_SOURCE_BRIDGE = 1;
const DATA_SOURCE_REMOTE = 2;

const DATA_TRANSFER_DIRECT = 4; //1 << 2
const DATA_TRANSFER_CACHE = 8; //2 << 2
const DATA_TRANSFER_PUSH = 12; //3 << 2

export enum DataSource {
  /**
   * 6.
   */
  remoteDirect = DATA_SOURCE_REMOTE | DATA_TRANSFER_DIRECT,

  /**
   * 14.
   */
  remotePush = DATA_SOURCE_REMOTE | DATA_TRANSFER_PUSH,

  /**
   * 10.
   */
  remoteCache = DATA_SOURCE_REMOTE | DATA_TRANSFER_CACHE,

  /**
   * Bridge
   */
  bridgeDirect = DATA_SOURCE_BRIDGE | DATA_TRANSFER_DIRECT,

  /**
   * 5.Bridge
   */
  bridgePush = DATA_SOURCE_BRIDGE | DATA_TRANSFER_PUSH,

  /**
   * 9.Bridge
   */
  bridgeCache = DATA_SOURCE_BRIDGE | DATA_TRANSFER_CACHE,
}

export function isFromRemoteSourceType(from: DataSource) {
  return (from & DATA_SOURCE_REMOTE) === DATA_SOURCE_REMOTE;
}

export function isFromCacheTransferType(from: DataSource) {
  return (from & DATA_TRANSFER_CACHE) === DATA_TRANSFER_CACHE;
}

/**
 *
 */
export enum API_STATUS {
  NotStarted = 0,
  /**
   * 1.
   */
  Loading = 1,

  /**
   * 2.
   */
  LoadOk = 2,

  /**
   * 3.
   */
  LoadError = 3,
}
