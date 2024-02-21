const webp = require('webp-converter');
const { RawSource } = require('webpack-sources');
const path = require('path');

function isImage(extname) {
  if (extname === '.png' || extname === '.jpg') {
    return true;
  }
  return false;
}
class WebpPlugin {
  options;
  /**
   *
   * @param {*} options
   * @param {beforeConvert:(src)=>string|false|{doDeleteOrigin,src}}  webp false
   * @param {quality:number} 0-100
   */
  constructor(options) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { beforeConvert, ...rest } = options;
    this.options = rest;
    this.beforeConvert =
      options.beforeConvert ||
      function (src) {
        return src + '.webp';
      };
    this.options.quality = this.options.quality || 80;
    console.log('###WebpPlugin', this.options.quality);
  }

  async dealResource(resPath, compilation) {
    if (!resPath) {
      return;
    }
    const extname = path.extname(resPath);
    const basename = path.basename(resPath);
    if (!isImage(extname)) {
      return;
    }
    const raw = compilation.assets[resPath]._value;
    if (!raw) {
      return;
    }
    const dest = this.beforeConvert(resPath);
    if (!dest) {
      return;
    }
    const optionsCmds = [];
    optionsCmds.push('-q ' + (this.options.quality || 100));
    // optionsCmds.push('-metadata all')
    optionsCmds.push('-lossless');
    // optionsCmds.push('-f ' + (20))
    // optionsCmds.push('-sns '+(this.options.sns || 0)) // 0 100
    // optionsCmds.push('-sharpness '+(this.options.sharpness || 0)) // 0（ ） 7（ ）
    const data = await webp.buffer2webpbuffer(
      raw,
      extname.substr(1),
      optionsCmds.join(' ')
    );
    let itemRes = new RawSource(data);
    let doDeleteOrigin = false;
    let destSrc = dest;
    if (typeof dest !== 'string') {
      doDeleteOrigin = dest.doDeleteOrigin;
      destSrc = dest.src;
    }
    if (doDeleteOrigin) {
      delete compilation.assets[resPath];
    }
    //
    compilation.assets[destSrc] = itemRes;
    console.log(
      '[WEBP]',
      basename,
      ((data.length / raw.length) * 100).toFixed(2) + '%'
    );
  }
  apply(compiler) {
    compiler.hooks.emit.tapAsync('WebpPlugin', async (compilation, cb) => {
      const assets = Object.keys(compilation.assets);
      //   console.log('[WEBPPlugin] apply', applyCount++)
      for (let i of assets) {
        await this.dealResource(i, compilation);
      }
      cb();
    });
  }
}
module.exports = WebpPlugin;
