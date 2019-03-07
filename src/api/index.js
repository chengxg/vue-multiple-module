/**
 * 全局api 工具
 * @author chengxg
 * @since 2019-1-21
 */

import apiSource from './apiSource'

//装饰 app 的 url
import * as app from './app'
decorateApiURL(app);

/**
 * 改变api根路径
 * @param {Object} obj api模块
 * @param {String} moduleName 模块名
 */
export function decorateApiURL(obj) {
  if (obj.apiURL) {
    let moduleName = "";
    for (let k in obj.apiURL) {
      moduleName = getModuleNameByUrl(obj.apiURL[k]);
      if (apiSource[moduleName]) {
        obj.apiURL[k] = obj.apiURL[k].replace("/api/" + moduleName, apiSource[moduleName]);
      }
    }
  }
}

/**
 * 通过api请求路径获取模块名
 * @param {String} apiUrl 来自apiURL中的路径, 第二级为模块名
 */
function getModuleNameByUrl(apiUrl) {
  apiUrl = apiUrl.substring(5);
  let index = apiUrl.indexOf("/");
  if (index == -1) {
    index = apiUrl.indexOf(".");
  }
  if (index > -1) {
    apiUrl = apiUrl.substring(0, index);
  }
  return apiUrl
}

/**
 * 从返回结果中得到分页对象
 * @param {Object} data 
 */
export function getPageFromData(data) {
  if (!data) {
    return {
      pageNum: 1,
      total: 0,
      pageSize: 10
    }
  }
  return {
    pageNum: data.pageNum,
    total: data.total,
    pageSize: data.pageSize
  }
}
