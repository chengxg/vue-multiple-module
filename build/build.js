'use strict'
require('./check-versions')()

const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const buildWebpackConfig = require('./webpack.prod.conf')
var connect = require('connect')
var serveStatic = require('serve-static')

//生产打包模块
const buildModules = config.build.buildModules;
console.log("正在打包的模块：" + buildModules.join(" ") + "\n");

const spinner = ora('building for production...\n')
spinner.start()

buildModules.forEach(function (moduleName) {
  rm(path.join(config.build.assetsRoot, moduleName), err => {
    if (err) throw err
    let webpackConfig = buildWebpackConfig(moduleName);
    webpack(webpackConfig, (err, stats) => {
      spinner.stop()
      if (err) throw err
      process.stdout.write(
        stats.toString({
          colors: true,
          modules: false,
          children: false,
          chunks: false,
          chunkModules: false
        }) + '\n\n'
      )

      if (stats.hasErrors()) {
        console.log(chalk.red(moduleName + ' 构建出错.\n\n'))
        process.exit(1)
      }
      console.log(chalk.cyan(moduleName + ' 构建完成.\n\n'))
    })
  })
})
