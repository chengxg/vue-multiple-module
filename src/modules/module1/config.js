//程序全局配置
const config = {
	//以下字段必须要定义
	systemName: "系统名称",
	applicationName: "应用名称",
};

//测试环境
if(process.env.NODE_ENV === 'development') {

}

//生产环境
if(process.env.NODE_ENV === 'production') {

}

export default config