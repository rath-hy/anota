const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.API_URL': JSON.stringify('http://localhost:3001'),
      'process.env.FRONTEND_URL': JSON.stringify('http://localhost:5173')
    })
  ]
});