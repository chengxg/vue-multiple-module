'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

//系统模块
const devModules = config.dev.devModules;
//设置入口js
let entries = {};
devModules.forEach(function (name) {
  entries[name] = './src/modules/' + name + '/main.js';
});

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  entry: entries,
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: config.dev.assetsPublicPath
  },
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.dev.cssSourceMap,
      usePostCSS: true
    })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: true,
    hot: true,
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay ? {
      warnings: false,
      errors: true
    } : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    /*new HtmlWebpackPlugin({
    	filename: 'index.html',
    	template: 'index.html',
    	inject: true,
    	favicon: resolve('favicon.ico'),
    	title: 'vue-element-admin',
    	templateParameters: {
    		BASE_URL: config.dev.assetsPublicPath + config.dev.assetsSubDirectory,
    	},
    }),*/
  ]
})

//设置入口页面
devModules.forEach(function (name) {
  //访问路径
  let filename = './' + name + '/index.html';
  //模板页面
  let template = 'src/modules/' + name + '/index.html';
  if (name == 'index') {
    filename = "./index.html";
  }
  devWebpackConfig.plugins.push(new HtmlWebpackPlugin({
    filename: filename,
    template: template,
    chunks: [name], //跟entries里的名对应
    inject: true,
    favicon: './favicon.ico' //设置favicon
  }));
});

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(
        new FriendlyErrorsPlugin({
          compilationSuccessInfo: {
            messages: [
              `Your application is running here: http://${
			                devWebpackConfig.devServer.host
			              }:${port}`
            ]
          },
          onErrors: config.dev.notifyOnErrors ?
            utils.createNotifierCallback() : undefined
        })
      )

      resolve(devWebpackConfig)
    }
  })
})
