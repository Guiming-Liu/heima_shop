export default {
	// 开启命名空间
	namespaced: true,
	
	// state 数据
	state: () => ({
		address: JSON.parse(uni.getStorageSync('address') || '{}')
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