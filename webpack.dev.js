const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  
  // ✅ Mengabaikan folder sistem agar tidak kena EACCES
  watchOptions: {
    ignored: ['**/node_modules/**', '**/dist/**', '/data/**', '/storage/**', '**/.git/**'],
    poll: 1000,
  },

  devServer: {
    static: './dist',
    hot: true,
    watchFiles: ['src/**/*'],
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  },
});
