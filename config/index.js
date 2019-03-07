'use strict'
// Template version: 1.2.6
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path');
//生产地址webpack代理
const prodProxyTable = require("./prodProxyTable");
//测试地址webpack代理
const testProxyTable = require("./testProxyTable");
//当前webpack代理的模块, prodProxyTable或testProxyTable
const proxyTable = testProxyTable;

/**
 * 系统所有模块, 也就是 src/modules 文件夹下的模块项目名
 * 每添加一个模块在此处添加一个模块名
 */
let sysModuleArr = ["index", "module1", "module2"];

/**
 * 开发时的启动模块, 来自sysModuleArr中的部分模块或全部模块
 * 如果测试服务器启动缓慢, 可以去掉当前不需要的模块
 */
let devModules = sysModuleArr;

/**
 * 生产打包的模块, 来自sysModuleArr中的部分模块或全部模块
 * 一次可以同时打包多个模块
 */
let buildModules = [
	"index", "module1", "module2"
]

module.exports = {
	dev: {
		//开发时启动的模块
		devModules: devModules,
		//启用后台测试环境的代理 或 生产环境的代理
		proxyTable: proxyTable,

		// Paths
		assetsSubDirectory: 'static',
		assetsPublicPath: '/',
		// Various Dev Server settings
		// can be overwritten by process.env.HOST
		// if you want dev by ip, please set host: '0.0.0.0'
		host: '0.0.0.0',
		port: 3000, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
		autoOpenBrowser: true,
		errorOverlay: true,
		notifyOnErrors: false,
		poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

		// Use Eslint Loader?
		// If true, your code will be linted during bundling and
		// linting errors and warnings will be shown in the console.
		useEslint: false,
		// If true, eslint errors and warnings will also be shown in the error overlay
		// in the browser.
		showEslintErrorsInOverlay: false,

		/**
		 * Source Maps
		 */
		// https://webpack.js.org/configuration/devtool/#development
		devtool: 'source-map',

		// CSS Sourcemaps off by default because relative paths are "buggy"
		// with this option, according to the CSS-Loader README
		// (https://github.com/webpack/css-loader#sourcemaps)
		// In our experience, they generally work as expected,
		// just be aware of this issue when enabling this option.
		cacheBusting: true,
		cssSourceMap: true
	},
	build: {
		buildModules: buildModules,
		assetsRoot: path.resolve(__dirname, '../dist'),
		assetsSubDirectory: 'static',
		assetsPublicPath: './',

		/**
		 * Source Maps
		 */
		productionSourceMap: true,
		// https://webpack.js.org/configuration/devtool/#production
		devtool: 'source-map',

		// Gzip off by default as many popular static hosts such as
		// Surge or Netlify already gzip all static assets for you.
		// Before setting to `true`, make sure to:
		// npm install --save-dev compression-webpack-plugin
		productionGzip: true,
		productionGzipExtensions: ['js', 'css'],

		// Run the build command with an extra argument to
		// View the bundle analyzer report after build finishes:
		// `npm run build:prod --report`
		// Set to `true` or `false` to always turn it on or off
		bundleAnalyzerReport: false,
		// `npm run build:prod --generate_report`
		generateAnalyzerReport: false
	}
}