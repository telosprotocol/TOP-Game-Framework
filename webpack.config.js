const path = require('path');
const { getProcessArg } = require('./build/libs');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin')

// the path(s) that should be cleaned
const entrys = {
  // localPlugin: path.resolve('./build-src/localPlugin.ts'),
  lang2excel: path.resolve('./build-src/lang2excel.ts'),
};
let entry = entrys;
const customEntry = getProcessArg('custom_entry') || 'lang2excel';
if (customEntry) {
  entry = {};
  entry[customEntry] = entrys[customEntry];
}
// console.dir(customEntry)
// console.dir(entry)
const destDir = './build';
module.exports = {
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
  },
  target: 'node',
  // devtool: 'source-map', //     js      map  （       ）
  mode: process.env.mode || 'production',
  entry,
  output: {
    filename: '[name].js', //    fiename   package.json  main
    path: path.resolve(__dirname, `${destDir}`),

    // libraryTarget: 'commonjs',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: path.resolve('./build-src/tsconfig.json'), //__dirname,
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
};
