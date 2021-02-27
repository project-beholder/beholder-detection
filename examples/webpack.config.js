/* eslint-disable */
var path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: {
    index: ['./index.js'],
    canvas_test: ['./canvas_test.js'],
  },
  mode: 'development',

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|build)/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        exclude: /(node_modules|build)/,
        loader: 'css-loader',
      },
    ],
  },
};