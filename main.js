import App from './App'

// 配置网络请求
import {$http} from '@escook/request-miniprogram'
uni.$http = $http
// 配置请求根路径
$http.baseUrl = 'https://api-hmugo-web.itheima.net'
// 请求开始之前，做一些事情
$http.beforeRequest = (options) => {
	uni.showLoading({
		title: '数据加载中...'
	})
	
	// 判断请求的是否为有权限额API接口
	if(options.url.indexOf('/my/') !== -1) {
		// 为请求头添加身份认证字段
		options.header = {
			// 字段的值可以直接从vuex中进行获取
			Authorization: store.state.m_user.token,
		}
	}
}
// 请求完成之后，做一些事情
$http.afterRequest = (res) => {
	uni.hideLoading()
	if(res.data.meta.status !== 200) {
		return uni.showToast({
			title: '数据请求失败！',
			duration: 1500,
			icon: 'none'
		})
	}
}

// 封装展示消息提示的方法
uni.$showMsg = function(title = '数据请求失败！', duration = 1500) {
	uni.showToast({
		title,
		duration,
		icon: 'none'
	})
}




// #ifndef VUE3
import Vue from 'vue'
import store from 'store/store.js'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App,
	store
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif