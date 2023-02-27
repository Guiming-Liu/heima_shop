export default {
	// 开启命名空间
	namespaced: true,
	
	// state 数据
	state: () => ({
		address: JSON.parse(uni.getStorageSync('address') || '{}'),
		token: uni.getStorageSync('token') || '',
		userInfo: JSON.parse(uni.getStorageSync('userInfo') || '{}'),
		redirectInfo: null
	}),
	
	mutations: {
		// 更新收货地址
		updateAddress(state, address) {
			state.address = address
			this.commit('m_user/saveAddressToStorage')
		},
		
		// 把地址address持久化到本地
		saveAddressToStorage(state) {
			uni.setStorageSync('address', JSON.stringify(state.address))
		},
		
		// 更新用户的基本信息
		updateUserInfo(state, userInfo) {
			state.userInfo = userInfo
			this.commit('m_user/saveUserInfoToStorage')
		},
		
		// 将userInfo持久化存储到本地
		saveUserInfoToStorage(state) {
			uni.setStorageSync('userInfo', JSON.stringify(state.userInfo))
		},
		
		// 更新token
		updateToken(state, token) {
			state.token = token
			this.commit('m_user/saveTokenToStorage')
		},
		
		// 将 token 字符串持久化存储到本地
		saveTokenToStorage(state) {
		    uni.setStorageSync('token', state.token)
		},
		
		// 更新重定向的信息对象
		  updateRedirectInfo(state, info) {
			  state.redirectInfo = info
		  }
	},
	
	getters: {
		// 收货详细地址的计算属性
		addstr(state) {
			if(!state.address.provinceName) return ''
			
			// 拼接省市区和详细地址的字符串，并返回给用户
			return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
		}
	}
}