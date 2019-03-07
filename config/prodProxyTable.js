/** 
 * 生产系统的webpack代理路径
 * @author chengxg
 * @since 2019-1-25
 */

module.exports = {
	//接口
	'/api': {
		target: 'http://xxxx.xxx.xxx/api',
		changeOrigin: false,
		secure: true,
		pathRewrite: {
			'^/api': ''
		}
	},
};