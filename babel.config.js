module.exports = {
  presets: [
    [
      '@vue/cli-plugin-babel/preset',
      {
        polyfills: [],
      },
    ],
  ],

  plugins: [
    [
      'import',
      {
        libraryName: 'vant',
        libraryDirectory: 'es',
        style: true,
      },
      'vant',
    ],

    /* lodash  ， ：https://github.com/lodash/babel-plugin-lodash */
    // ['lodash'],
  ],
};
