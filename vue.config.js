const { defineConfig } = require('@vue/cli-service');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer'); // disable for Netlify

module.exports = defineConfig({
  publicPath: '/jobcrest-form/',
  transpileDependencies: true,
  configureWebpack: {
    // plugins: [new BundleAnalyzerPlugin()] // disable this
  }
});
