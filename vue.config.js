const { defineConfig } = require('@vue/cli-service')
const NodePolyfillPlugin=require('node-polyfill-webpack-plugin')

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack:{
    plugins:[new NodePolyfillPlugin]
  },
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = '集集復集集';
      args[0].favicon = 'favicon.ico';
      return args;
    });
  },
  outputDir: 'dist'
})

/*
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})
*/