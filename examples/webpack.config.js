/* eslint-disable */
var path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: './index.js',
  mode: 'development',

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'app.js',
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
};