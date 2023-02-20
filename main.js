import App from './App'

// 配置网络请求
import {$http} from '@escook/request-miniprogram'
uni.$http = $http
// 配置请求根路径
$http.baseUrl = 'https://www.uinav.com'
// 请求开始之前，做一些事情
$http.beforeRequest = () => {
	uni.showLoading({
		title: '数据加载中...'
	})
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
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
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