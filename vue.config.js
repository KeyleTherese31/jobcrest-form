const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  publicPath: '/jobcrest-form/',
  configureWebpack: {
    plugins: [new BundleAnalyzerPlugin()]
  }
};

// vue.config.js
export default {
  publicPath: '/jobcrest-form/'
}
