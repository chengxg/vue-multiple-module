/**
 * mock 的一些工具, 
 * 1.拦截ajax请求的url工具,获取url path参数, url query参数, body参数
 * 2.与后台交互的基础数据格式工具
 * @author chengxg
 * @since 2019-1-11
 */

import Mock from 'mockjs';
let Random = Mock.Random;
import myUtil from '../utils/myUtil'

/**
 * mock数据的一些规则
 */
export const mockRule = {
  phone: /^1[385][1-9]\d{8}/,
  /**
   * 生成code
   * @param {String} prefix 前缀 
   */
  generateCode: function (prefix = "") {
    return prefix + Random.datetime("yyyyMMddHHmmss") + Random.natural(1000000, 9999999);
  },
  /**
   * 从枚举中获取所有的key
   * @param {enum} statusEnum 模块statusEnum中的枚举
   * @param {boolean} keyIsNumber key是否是数字 
   */
  getEnumKeys: function (statusEnum, keyIsNumber = true) {
    return Object.keys(statusEnum).filter((item) => {
      if (keyIsNumber) {
        return !isNaN(item)
      } else {
        return isNaN(item)
      }
    })
  },
  /**
   * 返回一个随机的 枚举 状态
   * @param {enum} statusEnum 
   * @param {boolean} keyIsNumber 
   */
  getEnumKey: function (statusEnum, keyIsNumber = true) {
    let keys = this.getEnumKeys(statusEnum, keyIsNumber);
    return Random.pick(keys);
  }
}

/**
 * 拦截ajax请求的url
 * @param {String} url 
 */
function interceptURL(url) {
  url = url.replace(/\{(.*?)\}/g, function (match, match2) {
    return ".*"
  })
  return new RegExp(url + ".*");
}

/**
 * 解析url path参数
 * @param {String} tpl 模板url 必须符合类似于"/api/menu/{app}/{module}.json"形式
 * @param {String} url 实际url "/api/menu/appName/moduleName.json"
 * @returns {Object} params 返回解析后的参数 {app:'appName',module:'moduleName'}
 */
function resolveUrlPathPrams(tpl, url) {
  let tplPathArr = tpl.split("/");
  let urlPathArr = url.split("/");
  let params = {};
  //对比两者差异, 获取其路径参数
  tplPathArr.forEach((path, index) => {
    let end = path.indexOf("}");
    if (path.charAt(0) == "{" && end > 1) {
      let name = path.substring(1, end);

      let data = urlPathArr[index] || "";
      let suffixIndex = data.indexOf(".");
      if (suffixIndex > -1) {
        params[name] = data.substring(0, suffixIndex)
      } else {
        params[name] = data;
      }
    }
  });
  return params;
}

/**
 * 启用模块mock数据, 方法名已"_"开头的将被过滤掉
 * @param {String} module 模块名
 */
export function mockEnable(module) {
  if (!module) return;
  for (let k in module) {
    if (typeof module[k] === 'function' && k.charAt(0) != '_') {
      module[k]();
    }
  }
}

/**
 * 得到页面的权限列表, 也就是登陆成功时获取用户返回的authorities 字段
 * @param {Array} routes 模块的路由列表
 * @param {Object} config 模块的配置 
 * @returns {Array} pagesPathAuthorities
 */
export function getPagesPathAuthorities(routes, config) {
  let pagesPathAuthorities = [];
  //将路径全部添加到 authorities
  routes.forEach(router => {
    pagesPathAuthorities.push({
      applicationName: config.applicationName,
      moduleName: config.backendModuleName,
      authority: "",
      code: "",
      url: router.path,
    })
    router.children && router.children.forEach((routerChild) => {
      pagesPathAuthorities.push({
        applicationName: config.applicationName,
        moduleName: config.backendModuleName,
        authority: "",
        code: "",
        url: routerChild.path,
      })
    })
  });
  return pagesPathAuthorities;
}

/**
 * 拦截get请求
 * @param {String} url url
 * @param {Function} dataCreate 创建数据函数
 */
export function ajaxGet(url, dataCreate) {
  Mock.mock(interceptURL(url), function (req) {
    let pathParams = resolveUrlPathPrams(url, req.url);
    let queryParams = myUtil.resoveURLParams(req.url);
    let params = Object.assign({}, queryParams, pathParams);
    return dataCreate(params);
  })
}

/**
 * 拦截post请求
 * @param {String} url 
 * @param {Function} dataCreate 
 */
export function ajaxPost(url, dataCreate) {
  Mock.mock(interceptURL(url), function (req) {
    console.log(req)
    let bodyParams = {};
    let pathParams = resolveUrlPathPrams(url, req.url);
    try {
      bodyParams = JSON.parse(req.body);
    } catch (e) {}
    let queryParams = myUtil.resoveURLParams(req.url);
    //合并body参数, query参数, url path参数
    let params = Object.assign({}, bodyParams, queryParams, pathParams);
    let data = dataCreate(params, req.body);
    console.log(data);
    return data;
  })
}

/**
 * 返回基础数据
 * @param {Object} dataTpl 数据模板
 * @param {*} probability 成功与否的概率
 */
export function dataSuccess(dataTpl, probability = 1) {
  let s = Math.random() <= probability;
  return Mock.mock({
    "data": dataTpl,
    "message": s ? "" : "@csentence",
    "success": s
  })
}

/**
 * 返回列表数据
 * @param {Object} dataTpl 
 * @param {Number} len 列表数据长度
 * @param {Number} probability 成功与否的概率
 */
export function dataList(dataTpl, len = 10, probability = 1) {
  let s = Math.random() <= probability;
  let tpl = {
    "message": s ? "" : "@csentence",
    "success": s
  }
  tpl["data|1-" + len] = [dataTpl];
  return Mock.mock(tpl)
}

/**
 * 返回列表分页的数据
 * @param {Object} dataTpl 
 * @param {Page} page 分页对象
 * @param {Number} probability 成功与否的概率
 */
export function dataListPage(dataTpl, page, probability = 1) {
  page = page || {};
  page.pageSize = page.pageSize * 1 || 10;
  page.pageNum = page.pageNum * 1 || 1;
  page.total = page.total * 1 || 25;
  page.pages = page.pages * 1 || 3;

  let s = Math.random() <= probability;
  let tpl = {
    "message": s ? "" : "@csentence",
    "success": s,
    ...page
  }
  tpl["data|1-" + page.pageSize] = [dataTpl];
  return Mock.mock(tpl);
}
