/* eslint-disable */
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'beholder-detection.js',
    library: 'beholder-detection',
    libraryTarget: 'umd',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|build)/,
        loader: 'babel-loader',
      },
    ],
  },

  externals: {
    "mathjs": {
      commonjs: 'mathjs',
      commonjs2: 'mathjs',
      amd: 'mathjs',
      root: 'mathjs',
    },
  },
};