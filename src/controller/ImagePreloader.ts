export default class ImagePreloader {
  private static _ins: ImagePreloader;
  static get Instance() {
    if (!this._ins) {
      this._ins = new ImagePreloader();
    }
    return this._ins;
  }
  private constructor() {}

  private list: string[] = [];

  private preloadMap = {} as Record<string, boolean>;

  private preloadingMap = {} as Record<string, boolean>;
  preloadImage(url: string, _priority = 0) {
    if (url && !this.preloadMap[url] && !this.preloadingMap[url]) {
      this.list.push(url);
      this.tryNextPreload();
    }
  }

  waitImageLoaded(url: string) {
    if (this.preloadMap[url]) {
      return Promise.resolve(true);
    }
    return new Promise<true>((resolve, reject) => {
      this.loadAImage(url, (isOK) => {
        if (isOK) {
          resolve(true);
        } else {
          reject();
        }
      });
    });
  }

  private loadAImage(url: string, cb: (isOK: boolean) => void) {
    this.preloadingMap[url] = true;
    const img = new Image();
    img.src = url;
    img.onload = () => {
      delete this.preloadingMap[url];
      this.preloadMap[url] = true;
      cb(true);
    };
    img.onerror = () => {
      delete this.preloadingMap[url];
      if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
        console.log('[Preload] preload image error', url);
      }
      cb(false);
    };
  }

  private lastTime: ReturnType<typeof setTimeout>;
  private tryNextPreload() {
    if (this.lastTime) {
      return;
    }
    this.lastTime = setTimeout(() => {
      this.lastTime = null;
      const url = this.list.shift();
      if (url) {
        this.loadAImage(url, (isOK) => {
          if (isOK) {
            if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
              console.log('[Preload] preload image ok', url);
            }
          } else {
            if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
              console.log('[Preload] preload image error', url);
            }
          }
        });

        if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
          console.log('[Preload] preload image', url);
        }
        if (this.list.length > 0) {
          this.tryNextPreload();
        }
      }
    }, 10);
  }
}
