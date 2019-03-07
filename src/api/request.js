/**
 * 公共ajax请求工具
 * @author chengxg
 * @since 2019-1-11
 */
import axios from 'axios'
import myUtil from '@/utils/myUtil'
import qs from 'qs'

import {
	MessageBox
} from 'element-ui'

/**
 * 创建一个axios实例
 */
export const http = axios.create({
	timeout: 1000 * 30,
	headers: {
		'Content-Type': 'application/json; charset=utf-8'
	},
	withCredentials: true, //表示跨域请求时是否需要使用凭证
	//验证http状态
	validateStatus: function(status) {
		return status >= 200 && status < 300 || status == 403 || status == 401 || status == 400;
	},
})

/**
 * 请求拦截 中间件
 */
http.interceptors.request.use(config => {
	return config;
}, error => {
	return Promise.reject(error)
})

/**
 * 响应拦截
 */
http.interceptors.response.use(response => {
	return response
}, error => {
	return Promise.reject(error)
})

/**
 * 替换url传参
 * @param {String} url 
 * @param {Object} params 必须是平铺的object
 */
export function replaceUrlPathParams(url, params) {
	return url.replace(/\{(.*?)\}/g, function(match, match2) {
		let replace = params[match2];
		//删掉params中的属性，避免在url query参数上再次添加
		if(typeof params[match2] != 'undefined') {
			delete params[match2];
		}
		return replace
	})
}

/**
 * get请求
 * @param {String} url 来自apiURL中的url
 * @param {Object} params url query参数和url path参数 必须是一个无格式对象(plain object) 和 urlpath 参数
 * @param {Object|String} options 操作参数, 目前只有errTip 错误提示
 * @param {Object} config 其他axios配置参数
 */
export function ajaxGet(url, params, options = {}, config = {}) {
	let errTip = ""; //错误提示
	if(typeof errTip === 'string') {
		errTip = options;
	} else {
		if(myUtil.isObject(options)) {
			errTip = options.errTip;
		}
	}
	url = replaceUrlPathParams(url, params);

	return new Promise((resolve, reject) => {
		http({
			method: 'get',
			url: url,
			params: params,
			...config
		}).then((res) => {
			if(res.status == 403) {
				MessageBox.alert("请求失败, 您暂时没有相关的访问权限!", "错误提示", {
					type: 'error'
				});
				reject(res);
				return;
			}
			if(res.status == 401) {
				MessageBox.alert("请求失败, 您未登陆, 请先登陆!", "错误提示", {
					type: 'error'
				});
				reject(res);
				return;
			}
			if(res.status == 400) {
				MessageBox.alert(res.data.exception ? res.data.exception.substring(0, 200) : "", "错误提示", {
					type: 'error'
				});
				reject(res);
				return;
			}

			if(res.status !== 200) {
				if(typeof res.data == 'object') {
					if(res.data.success) {
						resolve(res.data);
					} else {
						reject(res.data.message);
						errTip && MessageBox.alert(errTip + " " + res.data.message.substring(0, 200), "错误提示", {
							type: 'error'
						});
					}
					return;
				}
				resolve(res.data);
				return;
			}

			reject(res);
			errTip && MessageBox.alert("请求失败", "错误提示", {
				type: 'error'
			});
		}).catch((error) => {
			errTip && MessageBox.alert(errTip || "操作失败", "错误提示", {
				type: 'error'
			});
			reject(error);
		})
	})
}

/**
 * post请求
 * @param {String} url url
 * @param {Obect} data body参数
 * @param {Obect} params url query参数和url path参数 必须是一个无格式对象(plain object)
 * @param {Object|String} options 操作参数, 目前只有errTip 错误提示
 * @param {Object} config 其他axios配置参数
 */
export function ajaxPost(url, data, params, options = "", config = {}) {
	let errTip = ""; //错误提示
	if(typeof errTip === 'string') {
		errTip = options;
	} else {
		if(myUtil.isObject(options)) {
			errTip = options.errTip;
		}
	}
	url = replaceUrlPathParams(url, params);
	return new Promise((resolve, reject) => {
		let con = {
			method: 'post',
			url: url,
			data: data,
			params: params,
			...config
		};
		http(con).then((res) => {
			if(res.status == 403) {
				MessageBox.alert("请求失败, 您暂时没有相关的访问权限!", "错误提示", {
					type: 'error'
				});
				reject(res);
				return;
			}
			if(res.status == 401) {
				MessageBox.alert("您当前未登录, 请先登录!", "错误提示", {
					type: 'error'
				});
				reject(res);
				return;
			}
			if(res.status == 400) {
				MessageBox.alert(res.data.exception ? res.data.exception.substring(0, 200) : "", "错误提示", {
					type: 'error'
				});
				reject(res);
				return;
			}

			if(res.status == 200) {
				if(typeof res.data == 'object') {
					if(res.data.success) {
						resolve(res.data);
					} else {
						reject(res.data.message);
						errTip && MessageBox.alert(errTip + " " + res.data.message.substring(0, 200), "错误提示", {
							type: 'error'
						});
					}
					return;
				}
				resolve(res.data);
				return;
			}
			errTip && MessageBox.alert("请求失败", "错误提示", {
				type: 'error'
			});
			reject(res);
		}).catch((error) => {
			errTip && MessageBox.alert(errTip || "操作失败", "错误提示", {
				type: 'error'
			});
			reject(error);
		})
	})
}

/**
 * 导出通过href导出
 * @param {String} url 
 * @param {Object} params 
 */
export function exportUseHref(url, params) {
	let link = document.createElement('a');
	link.href = url + "?" + qs.stringify(params);
	link.click();
	window.URL.revokeObjectURL(link.href);
}