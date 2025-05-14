// vue.config.js
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  publicPath: '/jobcrest-form/',
  transpileDependencies: true,
  configureWebpack: {
    plugins: [new BundleAnalyzerPlugin()]
  }
};
