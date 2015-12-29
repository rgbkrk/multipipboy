/* eslint no-path-concat: 0 */
'use strict';

const webpack = require('webpack');
const path = require('path');

const inDev = process.env.NODE_ENV !== 'production';

let plugins = [];
if (inDev) {
  plugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ];
}

module.exports = {
  entry: [
    'webpack-hot-middleware/client',
    './index.jsx',
  ],
  context: path.join(__dirname, 'src'),
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: inDev ? 'react-hot!babel' : 'babel',
    }, {
      test: /\.css$/,
      loader: 'style!css!autoprefixer?browsers=last 2 versions',
    }, {
      test: /\.json$/,
      loader: 'json-loader',
    }],
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js',
  },
  plugins,
};
