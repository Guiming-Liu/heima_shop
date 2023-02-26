// 1. 导入Vue 和 Vuex
import vue from 'vue'
import vuex from 'vuex'
import moduleCart from './cart.js'
import moduleUser from './user.js'

// 2. 将Vuex 安装为 vue 的插件
vue.use(vuex)

// 3. 创建Store的实例对象
const store = new vuex.Store({
	// 挂载store模块
	modules: {
		m_cart: moduleCart,
		m_user:moduleUser,
	}
})

// 向外共享Store的实例对象
export default store