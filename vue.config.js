const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  configureWebpack: {
    plugins: [new BundleAnalyzerPlugin()]
  }
};