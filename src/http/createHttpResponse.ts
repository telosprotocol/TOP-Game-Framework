import { safePerformanceTimeNow } from '@/utils/datetime';

export function createHttpResponse<T>(res: {
  success: boolean;
  code?: number;
  message?: string;
  servertime?: number;
  data?: T;

  name?: string;
  logno?: string;
  /**
   * V
   */
  total?: number;
}) {
  return {
    Result: res.success ? 1 : 0,
    Reason: res.message,
    ErrCode: res.code,
    success: res.success,
    message: res.message,
    code: res.code ?? (res.success ? 200 : 0),
    data: res.data,
    servertime: res.servertime || getHttpCurrentTime(),
    name: res.name,
    logno: res.logno,
    total: res.total ?? 0, //for 204  total bug
  } as IHttpResponse<T>;
}
export function createHttpOKResponse<T>(data: T) {
  return createHttpResponse<T>({ success: true, data });
}
export function createHttpErrResponse<T>(msg?: string, code?: number) {
  return createHttpResponse<T>({
    success: false,
    message: msg,
    code: code || 500,
  });
}
export function getHttpCurrentTime() {
  return safePerformanceTimeNow();
}
