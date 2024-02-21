const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const WebpackDependencyPlugin = require('./build/webpack-dependency-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const { getProcessArg, resolveCompileEnv } = require('./build/libs');
const env = process.env;
const isDev = env.NODE_ENV === 'development';
// const isDNServer = env.VUE_APP_ENV_SERVER === 'development'
const path = require('path');
const ZipPlugin = require('zip-webpack-plugin');
const fs = require('fs');
const { minifySync } = require('terser-sync');
// const webpPreferLoader=require('webp-prefer-loader')
let hasPublicOnline = process.env.VUE_APP_ENV_NAME2 !== 'wallet' || isDev;
console.log('hasPublicOnline', hasPublicOnline);
const { H5Version } = require('./src/config/version');
const simAuthPath = './local/mySimAuth.txt';
let auth = 'MOCK';
if (fs.existsSync(simAuthPath)) {
  auth = fs.readFileSync(simAuthPath, { encoding: 'utf-8' });
}

const gitHash = getGitHash();
const gitTag = getGitRecentTag();
const DONT_EMIT_FOLDERNAME = '__online__';
process.env.VUE_APP_ENV_VERSION = gitTag || H5Version;
process.env.VUE_APP_ENV_BUILD_NUM = gitHash;
process.env.VUE_APP_ENV_SIM_AUTH = (auth || '').trim();
const PKG_NAME = process.env.VUE_APP_PKG || 'vgame';

// `${dateTimeFmt('MMddhhmm', new Date().getTime())}-${gitHash}`;
// console.log('gitinfo',gitHash,gitTag)
const REMOTE_HTML_NAME = 'remote.html';
//
const IS_ONLY_LOCAL = !!process.env.VUE_APP_ONLY_LOCAL; //

function resolve(dir) {
  return path.join(__dirname, '.', dir);
}

const isReport = getProcessArg('report') !== undefined;

/*           */
if (isDev) {
  const isEmpty = (prefix) => prefix === '' || prefix === '/';
  if (isEmpty(env.VUE_APP_BASEURL_API)) env.VUE_APP_BASEURL_API = '/@API';
}
console.log(
  `VUE_APP_ENV_NAME2=${process.env.VUE_APP_ENV_NAME2}, NODE_ENV=${
    process.env.NODE_ENV
  },VUE_APP_ONLY_LOCAL=${
    process.env.VUE_APP_ONLY_LOCAL
  },IS_ONLY_LOCAL=${IS_ONLY_LOCAL},${
    process.env.VUE_APP_ENV_VERSION
  },VUE_CPL_HAS_LOTTERY_MODULE=${
    process.env.VUE_CPL_ENV_HAS_LOTTERY_MODULE
  },${typeof process.env.VUE_CPL_ENV_HAS_LOTTERY_MODULE}`
);
const BrandName = 'Boss Slot';
// const ENTRYNAME_LIST = ['index', 'remote']
const HTML_WEBPACK_PLUGIN_COMMON_CONFIG = {
  title: BrandName,
  minify: {
    removeAttributeQuotes: false,
    removeComments: true,
    minifyJS: (text) => {
      if (text) {
        const res = minifySync(text, { ecma: 5 });
        return res.code;
      }
      return text;
    },
    minifyCSS: true,
    collapseWhitespace: true,
  },
  inject: false,
  template: './public/index.html',
};

function getGitHash() {
  const execSync = require('child_process').execSync;
  const gitHash = execSync('git show -s --format=%H').toString();
  if (gitHash) {
    return gitHash.substr(0, 7);
  }
  return gitHash;
}
function getGitRecentTag() {
  const execSync = require('child_process').execSync;
  const gitTag = execSync('git describe --abbrev=0 --tags').toString();
  if (gitTag) {
    return gitTag.split('\n')[0];
  }
  return gitTag;
}
// const commonChunks = ['chunk-vendors', 'chunk-common'];
const tdkDescription =
  'Gratis! Gratis! Gratis! Anda bisa menonton film baru HD secara gratis di ' +
  BrandName +
  '!';
module.exports = Object.assign({
  devServer: {
    /*         ：https://webpack.docschina.org/configuration/dev-server/#devserver-proxy */
    port: 9002,
    compress: true,
  },
  pages: {
    index: {
      ...HTML_WEBPACK_PLUGIN_COMMON_CONFIG,
      entry: './src/entry/wallet/main.ts',
      title: BrandName,
      filename: 'index.html',
      meta: {
        title: BrandName,
      },
      // chunks: [...commonChunks, 'index'],
    },
    remote: {
      ...HTML_WEBPACK_PLUGIN_COMMON_CONFIG,
      entry: './src/entry/landing/main.ts',
      title: BrandName,
      filename: REMOTE_HTML_NAME,
      meta: {
        title: BrandName,
        description: tdkDescription,
      },
      // chunks: [...commonChunks, 'index'],
      // templateParameters: {
      //   description: tdkDescription,
      // },
    },
    dialog: {
      ...HTML_WEBPACK_PLUGIN_COMMON_CONFIG,
      template: './public/dialog.html',
      entry: './src/entry/dialog/main.ts',
      title: BrandName,
      filename: 'dialog.html',
      meta: {
        title: BrandName,
      },
      // chunks: [...commonChunks, 'dialog'],
    },
    mix: {
      ...HTML_WEBPACK_PLUGIN_COMMON_CONFIG,
      entry: './src/entry/mix/main.ts',
      title: BrandName,
      filename: 'mix.html',
      meta: {
        title: BrandName,
        description: tdkDescription,
      },
      // chunks: [...commonChunks, 'mix'],
    },
    ppgame: {
      ...HTML_WEBPACK_PLUGIN_COMMON_CONFIG,
      entry: './src/entry/game/ppGame.ts',
      title: BrandName,
      filename: 'ppgame.html',
      meta: {
        title: BrandName,
        description: tdkDescription,
      },
      // chunks: [...commonChunks, 'ppgame'],
    },
  },

  assetsDir: 'static',
  publicPath: './', //env.BASE_URL || '/',

  css: {
    sourceMap: true,
    //  isDev
    //   ? env.DEV_CSS_SOURCEMAP === 'true'
    //   : env.VUE_APP_ENV_NAME2 === 'landing',
    loaderOptions: {
      postcss: {
        plugins: [
          // require('tailwindcss'),
          require('autoprefixer'),
          require('postcss-pxs-to-viewport')({
            unitToConvert: ['px'], //,'PX'
            //      BASEREMPX-->16
            viewportWidth: (360 * 10 * 16) / 36, //  tailwind 16px=1rem
            //
            minPixelValue: 3,
            unitPrecision: 5,
            fontViewportUnit: 'rem', //100vw ---10rem
            viewportUnit: 'rem',
          }),
          // require('cssnano')({//     bug
          //   preset: 'default',
          // }),
        ],
      },
    },
    // loaderOptions: {
    //   postcss: { ...(!isCssAutoprefixer && { autoprefixer: {} }) },
    // },·
  },

  productionSourceMap: true, //env.VUE_APP_ENV_NAME2 === 'landing',

  configureWebpack: (config) => {
    // config.optimization.splitChunks.cacheGroups.styles = {
    //   name: 'chunk-css',
    //   test: /\.(css|less)$/,
    //   chunks: 'all',
    //   enforce: true,
    // };
    // console.dir(config.optimization.splitChunks.cacheGroups);
    // config.optimization.runtimeChunk = {
    //   name: entrypoint =>{
    //     console.log('runtime',entrypoint.name)
    //     return  `runtime-${entrypoint.name}`
    //   }
    // }
    // config.optimization.splitChunks.automaticNameDelimiter = '-'
    // config.optimization.splitChunks.minSize = 5120
    // // config.optimization.splitChunks.maxSize = 1024 * 100;
    // // config.optimization.splitChunks.minChunks = 2;
    // // config.optimization.splitChunks.maxAsyncRequests = 10;
    // config.optimization.splitChunks.chunks = 'all'
    // config.optimization.splitChunks.maxInitialRequests = 5;
    // config.optimization.splitChunks={
    //   // maxSize: 300 * 1024,
    //   // minSize: 30*1024,
    //   cacheGroups: {
    //     vendors: {
    //       name: 'chunk-vendors',
    //       test: /[\\/]node_modules[\\/]/,
    //       priority: -10,
    //       chunks: 'initial'
    //     },
    //     common: {
    //       name: 'chunk-common',
    //       minChunks: 2,
    //       priority: -20,
    //       chunks: 'initial',
    //       reuseExistingChunk: true,
    //     },
    //     // //
    //     // acommon: {
    //     //   name: 'chunk-acommon',
    //     //   minChunks: 3,
    //     //   priority: 1,
    //     //   chunks: 'async',
    //     //   reuseExistingChunk: true,
    //     // },
    //   },
    // }

    if (isDev) config.devtool = 'source-map';
    config.resolve.extensions = ['*', '.tsx', '.ts', '.js', '.vue', '.json'];
    config.resolve.alias['src'] = resolve('src');
  },
  chainWebpack: (config) => {
    if (isReport) {
      config.plugin('webpack-bundle-analyzer').use(BundleAnalyzerPlugin, [
        {
          analyzerMode: 'server',
          analyzerPort: 9001,
        },
      ]);
    }
    config.resolve.alias.set(
      './lang/zh-CN',
      path.resolve(__dirname, './src/alias/vant/vantDefaultLang')
    );
    config.module
      .rule('i18n')
      .resourceQuery(/blockType=i18n/)
      .type('javascript/auto')
      .use('i18n')
      .loader('@kazupon/vue-i18n-loader')
      .end();
    let zipFileName;
    const isDNRelease =
      process.env.NODE_ENV === 'production' &&
      process.env.VUE_APP_ENV_SERVER === 'development';
    config.plugin('LocalPlugin').use(WebpackDependencyPlugin, [
      {
        getDeleteAssetList: IS_ONLY_LOCAL
          ? function getDeleteAssetList({
              // chunkInfoMap,
              entryInfoMap,
              stats,
              substractArray,
            }) {
              const list = substractArray(entryInfoMap.remote.assets, [
                ...entryInfoMap.index.assets,
                ...entryInfoMap.dialog.assets,
                ...entryInfoMap.mix.assets,
                ...entryInfoMap.ppgame.assets,
              ]).filter((item) => {
                if (
                  item.endsWith('.js') ||
                  item.endsWith('.css') ||
                  item.endsWith('.map')
                ) {
                  return false;
                }
                return true;
              });
              //   map
              const list2 = [];
              stats.assets.forEach((item) => {
                if (item.name.endsWith('.map') && !isDNRelease) {
                  //  sentry
                  list2.push(item.name);
                }
              });
              console.log(
                'LocalPlugin DEL LIST（all map file）',
                list,
                REMOTE_HTML_NAME
              );
              return {
                fileDelList: [],
                assetDelList: [REMOTE_HTML_NAME, ...list, ...list2],
              };
            }
          : null,
        afterDelete: function (compilation) {
          if (hasPublicOnline) {
            compilation.assets['mix2.html'] = compilation.assets['mix.html'];
          }
        },
      },
    ]);
    if (IS_ONLY_LOCAL) {
      if (!isDev) {
        zipFileName = `${PKG_NAME}_${
          process.env.VUE_APP_BUILD_ENV_MODE
        }_v${H5Version.split('.').join('')}_${
          process.env.VUE_APP_ENV_BUILD_NUM
        }_${process.env.VUE_APP_ENV_NAME2}.zip`;
        const distZipDir = resolve('dist.zip');
        if (!fs.existsSync(distZipDir)) {
          fs.mkdirSync(distZipDir);
        }
        config.plugin('ZIP').use(ZipPlugin, [
          {
            path: resolve('dist'), //        (   dist)
            filename: zipFileName, //
          },
        ]);
      }
    }

    // typescript   loader
    //#region ts
    config.module
      .rule('ts')
      .test(/\.tsx?$/)
      .exclude.add(resolve('node_modules'))
      .end()
      .use('cache-loader')
      .loader('cache-loader')
      .options({
        cacheDirectory: resolve('node_modules/.cache/ts-loader'),
      })
      .end()
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      .use('ts-loader')
      .loader('ts-loader')
      .options({
        //
        transpileOnly: true, //isDev?true: false, //       ，      (      webpack  (fork-ts-checker-webpack-plugin)         ,           ,    transpileOnly false,            ts-loader  ,         .           )
        appendTsSuffixTo: ['\\.vue$'],
        happyPackMode: false,
      })
      .end();
    // eslint      (       loader)
    config.module
      .rule('eslint')
      .test(/\.((j|t)sx?)$/)
      .pre() // eslint pre
      .use('eslint-loader')
      .loader('eslint-loader')
      .tap((options) => {
        options.fix = true;
        options.extensions = ['.js', '.jsx', '.vue', '.ts', '.tsx'];
        return options;
      })
      .end();
    config.plugin('circular-dependency').use(CircularDependencyPlugin, [
      {
        exclude: /node_modules/,
        include: /src/,
        failOnError: true,
        // allow import cycles that include an asyncronous import,
        // e.g. via import(/* webpackMode: "weak" */ './file.js')
        allowAsyncCycles: false,
        // set the current working directory for displaying module paths
        cwd: process.cwd(),
      },
    ]);

    //#endregion

    config.plugin('define').tap((args) => {
      const env = args[0];
      resolveCompileEnv(env);
      return args;
    });
    //    prefetch
    config.plugins.delete('prefetch-index');
    config.plugins.delete('prefetch-remote');

    //    preload
    config.plugins.delete('preload-index');
    config.plugins.delete('preload-remote');

    if (config.plugins.has('extract-css')) {
      config.plugin('extract-css').tap((args) => {
        args[0].ignoreOrder = true;
        return args;
      });
    }
    // config.module.rule('svg').exclude.add(svgSpriteIconsDir)
    if (config.plugins.has('copy')) {
      config.plugin('copy').tap((args) => {
        const [list] = args;
        // list[0].ignore.push('.eslintrc.js', '.prettierrc.js')
        if (hasPublicOnline) {
          list.push({
            from: resolve('public_online'),
            to: resolve('dist'),
            toType: 'dir',
          });
          list.push({
            from: resolve('online'),
            to: resolve('dist/online'),
            toType: 'dir',
          });
        }
        // if (process.env.VUE_APP_ENV_SERVER === 'production') {
        //   list.push({
        //     from: resolve('s3/' + PKG_NAME),
        //     to: resolve('dist/s3'),
        //     toType: 'dir',
        //   });
        // }
        if (zipFileName) {
          list.push({
            from: resolve('dist/' + zipFileName),
            to: resolve('dist.zip/' + zipFileName),
            toType: 'file',
          });
        }
        return args;
      });
    }
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap((options) =>
        Object.assign(options, {
          limit: 512,
          fallback: {
            loader: 'webp-prefer-loader',
            options: {
              name: 'static/img/[name].[hash:8].[ext]',
              beforeConvert({
                // resourceQuery,
                resourcePath,
                resourceQueryObj,
                outputPath,
              }) {
                const dontEmit =
                  IS_ONLY_LOCAL &&
                  resourcePath.indexOf(DONT_EMIT_FOLDERNAME) > 0;
                if (resourceQueryObj.webp == null) {
                  if (dontEmit) {
                    //      __online__
                    return {
                      dontEmitOrigin: true,
                    };
                  }
                  return false;
                }
                const webpOutputPath = outputPath + '.webp';
                return {
                  //      png
                  dontEmitOrigin: !!IS_ONLY_LOCAL, //!!IS_ONLY_LOCAL,
                  //   png          webp
                  webpSrcPath: resourcePath + '.webp',
                  //
                  webpOutputPath: dontEmit ? null : webpOutputPath,
                };
              },
            },
          },
        })
      );
    // ENTRYNAME_LIST.forEach(item => {
    //   const pluginName = `html-${item}`
    //   if (config.plugins.has(pluginName)) {
    //     config.plugin(pluginName).tap(args => {
    //       const [option] = args
    //       // option.inject = false
    //       return args
    //     })
    //   }
    // });
  },
});
/*if (env.NODE_ENV) {
  if (
    !/^(development|production|test)$/.test(env.NODE_ENV) ||
    env.VUE_APP_ENV_NAME2 === undefined ||
    !/^(sim|wallet|landing)$/.test(env.VUE_APP_ENV_NAME2) ||
    (env.VUE_APP_ENV_NAME2 === 'wallet' && !IS_ONLY_LOCAL)
  ) {
    throw new Error('               ')
  }
}*/
