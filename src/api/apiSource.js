/**
 * 所有模块的数据源
 * @author chengxg
 * @since 2019-1-21
 */
//生产api
let apiSource = {
	module1: "/api/module1/v1",
	module2: "/api/module2/v1",
}

//测试环境
if(process.env.NODE_ENV === 'development') {
	apiSource.module1 = "/api/module1/v1";
	apiSource.module2 = "/api/module2/v1";
}

export default apiSource