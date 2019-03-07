/**
 * 全局模块的api
 * 1.获取所有的系统模块
 * 2.获取当前模块下的所有菜单
 * @author chengxg
 * @since 2019-1-11
 */

import {
	http,
	ajaxGet,
	ajaxPost,
} from './request'

/**
 * 模块所有的url路径, 统一写到这里
 * 路径规则 '/api/模块名/子路径' 至少两级
 * 1. 便于统一修改数据来源, 切换测试, 生产环境
 * 2. mock拦截ajax请求的api来自这里
 * 3. mock拦截ajax请求的url path参数模板
 * 4. webpack 代理的路径
 */
export const apiURL = {
	modules: "/api/manage/backendmenus.json",
	/* url path参数的写法, 同swagger
	调用ajaxGet,ajaxPost方法时, 
	将该路径参数添加到params参数上(url query参数) */
	sidebarMenus: "/api/manage/menu/{app}/{module}.json",
};
