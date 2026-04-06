const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.API_URL': JSON.stringify('https://anota-rq97.onrender.com'),
      'process.env.FRONTEND_URL': JSON.stringify('https://anota.puthyrathy.com')
    })
  ]
});