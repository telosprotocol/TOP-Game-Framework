export function buildFullPath(baseURL: string, url: string): string;

export function buildURL(
  fullPath: string,
  params?: any,
  paramsSerializer?: (params: any) => string
): string;
