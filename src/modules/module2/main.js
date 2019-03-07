import Vue from 'vue'

//引入Element组件库
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/icons' // icon
Vue.use(Element)

//引入router, store
import router from './router'
import store from './store'

import myUtil from '@/utils/myUtil'
import eventBus from '@/utils/EventBus'
import config from './config'
import * as statusEnum from './statusEnum'
import api from './api'
Vue.prototype.$myUtil = myUtil;
Vue.prototype.$eventBus = eventBus;
Vue.prototype.$config = config;
Vue.prototype.$statusEnum = statusEnum;
Vue.prototype.$api = api;

//mock数据设置
//require('./mock');
if(process.env.NODE_ENV === 'development') {
	//启用mock数据
	require('./mock');
}

//vue根实例
Vue.config.productionTip = false
import App from './App'
new Vue({
	el: '#app',
	router,
	store,
	render: h => h(App)
})