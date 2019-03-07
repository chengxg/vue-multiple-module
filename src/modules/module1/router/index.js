import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

export default new VueRouter({
	scrollBehavior(to, from, savedPosition) {
		if(savedPosition) {
			return savedPosition
		} else {
			return {
				x: 0,
				y: 0
			}
		}
	},
	routes: [{
		path: '/',
		name: 'Dashboard',
		component: (resolve) => require(['../pages/Dashboard.vue'], resolve),
		meta: {
			title: '首页',
			icon: 'guide'
		}
	}]
})