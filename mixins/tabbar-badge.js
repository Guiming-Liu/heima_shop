import {mapGetters} from 'vuex'
	// 导出一个mixins对象
	export default {
		computed: {
			...mapGetters('m_cart', ['total']),
		},
		watch: {
			// 监听total值的变化
			total() {
				// 调用methods中的setBadge方法，重新为tabBar的数字徽章赋值
				this.setBadge()
			}
		},
		onShow() {
			this.setBadge()
		},
		methods: {
			// 为tabBar里的购物车设置徽标
			setBadge() {
				uni.setTabBarBadge({
					index: 2,
					text: this.total + '' // text的值必须是字符串，不能是数字
				})
			}
		}
	}