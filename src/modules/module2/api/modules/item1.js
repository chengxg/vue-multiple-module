import {
  http,
  replaceUrlPathParams,
  ajaxGet,
  ajaxPost,
  exportUseHref
} from '../../../../api/request'

import {
  getPageFromData
} from '../../../../api'

import myUtil from '../../../../utils/myUtil'
import config from '../../config'
import {} from "../../statusEnum"

/**
 * 模块所有的url路径, 统一写到这里
 * 路径规则 '/api/模块名/子路径' 至少两级
 * 1. 便于统一修改数据来源, 切换测试, 生产环境
 * 2. mock拦截ajax请求的api来自这里
 * 3. mock拦截ajax请求的url path参数模板
 * 4. webpack 代理的路径
 */
export const apiURL = {
  api1: "/api/moduleName/item1/api1.json",
  api2: "/api/moduleName/item1/api2.json",
  //url path写法
  api3: "/api/moduleName/item1/list/{code}.json",
};

export function api1(queryParams, success, error) {
  ajaxPost(apiURL.api1, {}, queryParams, "查询item1_api1失败!").then((data) => {
    success && success(data.data);
  }).catch((err) => {
    error && error(err);
  });
}

export function api2(bodyParams, success, error) {
  ajaxPost(apiURL.api2, bodyParams, {}, "查询item1_api2失败!").then((data) => {
    let newPage = getPageFromData(data);
    success && success(newPage, data.data);
  }).catch((err) => {
    error && error(err);
  });
}

export function api3(pathParams, bodyParams, success, error) {
  ajaxPost(apiURL.api3, bodyParams, pathParams, "查询item1_api3失败!").then((data) => {
    success && success(data.data);
  }).catch((err) => {
    error && error(err);
  });
}
