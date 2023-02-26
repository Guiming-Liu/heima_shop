export default {
	// 为当前模块开启命名空间
	namespaced: true,
	
	state: () => ({
		// 购物车的数组，用来存储购物车中每个商品的信息对象
		// 每个商品的信息对象，都包含如下6个属性：
		// {goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state}
		cart: JSON.parse(uni.getStorageSync('cart') || '[]')
	}),
	
	getters: {
		// 统计购物车中商品的总数量
		total(state) {
			let c = 0
			// 循环统计商品的数量，累加到变量c中
			state.cart.forEach(goods => c += goods.goods_count)
			return c
		},
		
		// 勾选的商品的总数量
		checkedCount(state) {
			// 先使用filter方法，从购物车中过滤已勾选的商品
			// 再使用reduce方法，将已勾选的商品总数量进行累加
			// reduce()的返回值就是已勾选的商品的总数量
			return state.cart.filter(x => x.goods_state).reduce((total,item) => total += item.goods_count, 0)
		},
		
		// 已勾选的商品的总价
		checkedGoodsAmount(state) {
			// 先使用filter方法，从购物车中过滤已勾选的商品
			// 再使用reduce方法，将已勾选的商品数量*单价之后，进行累加
			// 最后使用 tofixed(2),保留两位小数
			return state.cart.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count * item.goods_price, 0).toFixed(2)
		}
	},
	
	mutations: {
		// 添加到购物车
		addToCart(state, goods) {
			// 根据提交的商品ID，查询购物车中是否存在这件商品
			// 如果不存在，则findResult 为 undefined; 否则，为查找的商品信息对象
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
			if(!findResult) {
				// 如果不存在，则直接把商品添加到购物车
				state.cart.push(goods)
			} else {
				// 如果存在，则只更新数量即可
				findResult.goods_count++
			}
			// 通过commit方法，调用saveToStorage
			this.commit('m_cart/saveToStorage')
		},
		
		// 将购物车中的数据持久化存储到本地
		saveToStorage(state) {
			uni.setStorageSync('cart', JSON.stringify(state.cart))
		},
		
		// 更新购物车中商品的勾选状态
		updateGoodsState(state, goods) {
			// 根据 goods_id 查询购物车中对应商品的信息对象
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
			// 更新对应商品的勾选状态
			if(findResult) {
				findResult.goods_state = goods.goods_state
				// 持久化存储到本地
				this.commit('m_cart/saveToStorage')
			}
		},
		
		// 更新购物车中商品的数量
		updateGoodsCount(state, goods) {
			// 根据goods_id查询购物车中对应的信息对象
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
			// 更新商品数量
			if(findResult) {
				findResult.goods_count = goods.goods_count
				// 持久化存储到本地
				this.commit('m_cart/saveToStorage')
			}
		},
		
		// 根据Id从购物车中删除对应的商品信息
		removeGoodsById(state, id) {
			// 调用数组的filter方法过滤数组
			state.cart = state.cart.filter(x => x.goods_id !== id)
			// 持久化存储到本地
			this.commit('m_cart/saveToStorage')
		},
		
		// 更新所有商品的勾选状态
		updateAllGoodsState(state, newState) {
			// 循环更新购物车中每件商品的勾选状态
			state.cart.forEach(x => x.goods_state = newState)
			// 持久化存储到本地
			this.commit('m_cart/saveToStorage')
		}
	},
	
}