const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

const API_URL = 'https://anota-rq97.onrender.com';
const FRONTEND_URL = 'https://anota.puthyrathy.com';

// Injects production host_permissions into the copied manifest.json asset
class ManifestHostPermissions {
  apply(compiler) {
    compiler.hooks.emit.tap('ManifestHostPermissions', compilation => {
      const asset = compilation.assets['manifest.json'];
      if (!asset) return;
      const manifest = JSON.parse(asset.source());
      manifest.host_permissions = [`${API_URL}/*`];
      const out = JSON.stringify(manifest, null, 2);
      compilation.assets['manifest.json'] = {
        source: () => out,
        size: () => out.length,
      };
    });
  }
}

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.API_URL': JSON.stringify(API_URL),
      'process.env.FRONTEND_URL': JSON.stringify(FRONTEND_URL),
    }),
    new ManifestHostPermissions(),
  ],
});
