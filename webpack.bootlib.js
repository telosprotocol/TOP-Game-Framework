const path = require('path');

module.exports = {
  target: 'web',
  mode: 'production',
  entry: {
    WebViewJavascriptBridge: path.resolve(
      __dirname,
      './src/init/boot/WebViewJavascriptBridge.js'
    ),
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, `./public`),
    libraryTarget: 'window',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
    ],
  },
};
