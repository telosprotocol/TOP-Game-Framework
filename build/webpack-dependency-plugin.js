const path = require('path');
const fs = require('fs');
class LocalPlugin {
  static PluginName = 'LocalPlugin';
  outputPath = '';
  opts;
  /**
   * @param {getDeleteAssetList({
   *  chunkInfoMap:{
   *    [chunkId:string]:{
   *      depList:string,
   *      entryList:string[]
   *    }
   *  },
   *  stats,
   *  entryInfoMap:{
   *    [entryName:string]:{
   *        entryName:string,// index|remote
   *        chunks:string[],//[chunkId,'chunk-xxx','index','chunk-vendor']
   *        assets:string[],//['static/xxx.json','static/xxx.json']
   *    }
   *  },
   *  substractArray(stringList1,stringList2)=>string[]
   * afterDelete(compilation)
   * })=>string[]} options
   */
  constructor(options) {
    console.log(LocalPlugin.PluginName + '-ctr');
    this.opts = options;
  }

  getFileType(str) {
    str = str.replace(/\?.*/, '');
    const split = str.split('.');
    let ext = split.pop();
    if (/^(gz|map)$/i.test(ext)) {
      ext = split.pop() + '.' + ext;
    }
    return ext;
  }

  doApplyPlugin(compiler) {
    console.log(`[${LocalPlugin.PluginName}] apply`);
    const emitCountMap = new Map();
    const outputFolder = compiler.options.output.path;
    const outputFile = path.resolve(outputFolder, './mainfest.json');

    function beforeRun(compiler, callback) {
      const emitCount = emitCountMap.get(outputFile) || 0;
      emitCountMap.set(outputFile, emitCount + 1);
      console.log(`[${LocalPlugin.PluginName}] BeforeRun`, emitCount);
      if (callback) {
        callback();
      }
    }

    let listToDelete = [];
    const emit = async (compilation, cb) => {
      //   const assets = Object.keys(compilation.assets)
      console.log(`[${LocalPlugin.PluginName}] emit`);

      const emitCount = emitCountMap.get(outputFile) - 1;
      emitCountMap.set(outputFile, emitCount + 1);
      const isLastEmit = emitCount === 0;
      if (!isLastEmit) {
        cb();
        return;
      }

      const { getDeleteAssetList, afterDelete } = this.opts;
      const stats = compilation.getStats().toJson({
        all: true,
        assets: true,
        cachedAssets: true,
        depth: true,
        chunkOrigins: true,
        children: true,
        chunks: true,
      });

      // files==> assets
      //#region entryInfoMap chunkInfoMap
      const assetsMap = {};
      const chunkMap = {};
      const chunkInfoMap = {}; //{[chunk.id]:{entryList:[],entryMap:{}}
      const entryInfoMap = {}; //{remote:{chunks:[],assets:[]}}

      stats.assets.forEach((asset) => {
        assetsMap[asset.name] = asset;
      });

      stats.chunks.forEach((item) => {
        chunkMap[item.id] = item;
        chunkInfoMap[item.id] = {
          depList: [],
          entryList: [],
        };
      });
      let searchMap = {};
      function searchForChunkObj(chunkName, entryInfoObj, parentChunkList) {
        if (searchMap[chunkName]) {
          return; //
        }
        searchMap[chunkName] = true;
        const chunk = chunkMap[chunkName];
        const chunkObj = chunkInfoMap[chunkName];
        if (chunkObj == null) {
          console.log(
            `[${LocalPlugin.PluginName}] asset is null ${chunkName},entryInfoObj=${entryInfoObj}`
          );
          return;
        }
        if (chunkObj.entryList.indexOf(entryInfoObj.entryName) === -1) {
          chunkObj.entryList.push(entryInfoObj.entryName);
        }
        if (entryInfoObj.chunks.indexOf(chunk.id) === -1) {
          entryInfoObj.chunks.push(chunk.id);
        }
        chunkObj.depList = [...chunkObj.depList, ...parentChunkList];

        chunk.files.forEach((filePath) => {
          if (entryInfoObj.assets.indexOf(filePath) === -1) {
            entryInfoObj.assets.push(filePath);
          }
        });
        //  image
        chunk.modules.forEach((module) => {
          module.assets.forEach((asset) => {
            if (!entryInfoObj.assets.includes(asset)) {
              entryInfoObj.assets.push(asset);
            }
          });
        });

        chunk.children.forEach((item) => {
          searchForChunkObj(item, entryInfoObj, [
            ...parentChunkList,
            chunkName,
          ]);
        });
      }
      const entryKeyList = Object.keys(stats.entrypoints);
      for (let entryKey in stats.entrypoints) {
        const entrypoint = stats.entrypoints[entryKey];
        entrypoint.chunks.forEach((chunk) => {
          if (!entryKeyList.includes(chunk)) {
            entryKeyList.push(chunk);
          }
        });
      }
      entryKeyList.forEach((entryKey) => {
        entryInfoMap[entryKey] = {
          entryName: entryKey,
          chunks: [],
          assets: [],
        };
        searchForChunkObj(entryKey, entryInfoMap[entryKey], []);
      });

      //#endregion

      function substractArray(stringList1, stringList2) {
        let list = [];
        stringList1.forEach((item) => {
          if (stringList2.indexOf(item) === -1) {
            list.push(item);
          }
        });
        return list;
      }
      if (getDeleteAssetList) {
        const { fileDelList, assetDelList } = getDeleteAssetList({
          chunkInfoMap,
          entryInfoMap,
          substractArray,
          stats,
        });
        listToDelete = fileDelList;
        assetDelList.forEach((item) => {
          delete compilation.assets[item];
        });
      }
      if (afterDelete) {
        afterDelete(compilation);
      }
      // fileDelList.forEach(item => {
      //   delete compilation.assets[item]
      // })
      // fileList.forEach(item => {
      //   // compilation.assets['del/' + item] = compilation.assets[item]
      //   delete compilation.assets[item]
      // })
      //#region debug jsons
      // function writeOutAsset(jsonObj, name) {
      //   let strJson = JSON.stringify(jsonObj)
      //   compilation.assets[name] = {
      //     source: function() {
      //       return strJson
      //     },
      //     size: function() {
      //       return strJson.length
      //     },
      //   }
      // }
      // const result = {
      //   assets: stats.assets.map(asset => {
      //     return {
      //       name: asset.name,
      //       chunks: asset.chunks,
      //       size: asset.size,
      //     }
      //   }),
      //   chunks: stats.chunks.map(chunk => {
      //     return {
      //       id: chunk.id,
      //       size: chunk.size,
      //       files: chunk.files,
      //       children: chunk.children,
      //       parents: chunk.parents, // Parent
      //       names: chunk.names, //  chunk
      //     }
      //   }),
      //   modules: stats.modules.map(module => {
      //     return {
      //       identifier: module.identifier,
      //       name: module.name,
      //       chunks: module.chunks,
      //       issuer: module.issuer,
      //       issuerPath: module.issuerPath,
      //       assets: module.assets,
      //       size: module.size,
      //     }
      //   }),
      // }
      // writeOutAsset(
      //   {
      //     assets: result.assets,
      //     chunks: result.chunks,
      //   },
      //   'mainfest-file.json'
      // )
      // writeOutAsset(entryInfoMap, 'mainfest-file-entrysInfo.json')

      // writeOutAsset(chunkInfoMap, 'mainfest-file-chunkInfoMap.json')

      // writeOutAsset(result.modules, 'mainfest-file-module.json')

      //#endregion
      cb();
    };

    const done = (stats) => {
      console.log(`[${LocalPlugin.PluginName}] done`);
      if (stats.hasErrors()) {
        if (this.verbose) {
          // eslint-disable-next-line no-console
          console.warn(
            `${LocalPlugin.PluginName}: pausing due to webpack errors`
          );
        }
        return;
      }

      try {
        listToDelete.forEach((item) => {
          const pathStr = path.join(this.outputPath, item);
          if (fs.existsSync(pathStr)) {
            fs.unlinkSync(pathStr);
            console.log(`[${LocalPlugin.PluginName}] remove-ok: ${item}`);
          } else {
            console.log(`[${LocalPlugin.PluginName}] notexsit: ${pathStr}`);
          }
        });
      } catch (error) {
        console.log(`[${LocalPlugin.PluginName}]  Error`, error);
        const needsForce =
          /Cannot delete files\/folders outside the current working directory\./.test(
            error.message
          );
        if (needsForce) {
          const message =
            LocalPlugin.PluginName +
            ': Cannot delete files/folders outside the current working directory. Can be overridden with the `dangerouslyAllowCleanPatternsOutsideProject` option.';

          throw new Error(message);
        }

        throw error;
      }

      // /**
      // * Fetch Webpack's output asset files
      // */
      // const assets =
      //   stats.toJson(
      //     {
      //       assets: true,
      //     },
      //     true,
      //   ).assets || [];
      // const assetList = assets.map((asset) => {//: { name: string }
      //   return asset.name;
      // });

      // /**
      //  * Get all files that were in the previous build but not the current
      //  *
      //  * (relies on del's cwd: outputPath option)
      //  */
      // const staleFiles = this.currentAssets.filter((previousAsset) => {
      //   const assetCurrent = assetList.includes(previousAsset) === false;

      //   return assetCurrent;
      // });

      // /**
      //  * Save assets for next compilation
      //  */
      // this.currentAssets = assetList.sort();
    };
    compiler.hooks.run.tap(LocalPlugin.PluginName, beforeRun);
    compiler.hooks.watchRun.tap(LocalPlugin.PluginName, beforeRun);
    compiler.hooks.emit.tapAsync(LocalPlugin.PluginName, emit);

    compiler.hooks.done.tap(LocalPlugin.PluginName, done);
  }

  apply(compiler) {
    const { getDeleteAssetList, afterDelete } = this.opts;

    if (!compiler.options.output || !compiler.options.output.path) {
      // eslint-disable-next-line no-console
      console.warn(
        `[${LocalPlugin.PluginName}]: options.output.path not defined. Plugin disabled...`
      );

      return;
    }
    this.outputPath = compiler.options.output.path;
    const usePlugin = !!getDeleteAssetList || !!afterDelete;
    if (usePlugin) {
      this.doApplyPlugin(compiler);
    }
  }
}

module.exports = LocalPlugin;
