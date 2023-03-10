<template>
	<view v-if="goods_info.goods_name">
		<!-- 轮播图区域 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<swiper-item v-for="(item, i) in goods_info.pics" :key="i">
				<!-- 把当前点击的图片的索引，传递到preview()函数中 -->
				<image :src="item.pics_big" @click="preview(i)"></image>
			</swiper-item>
		</swiper>
		
		<!-- 商品信息区域 -->
		<view class="goods-info-box">
			<!-- 商品价格 -->
			<view class="price">￥{{goods_info.goods_price}}</view>
			<!-- 信息主体区域 -->
			<view class="goods-info-body">
				<!-- 商品名称 -->
				<view class="goods-name">{{goods_info.goods_name}}</view>
				<!-- 收藏 -->
				<view class="favi">
					<uni-icons type="star" size="18" color="gray"></uni-icons>
					<text>收藏</text>
				</view>
			</view>
			<!-- 运费 -->
			<view class="yf">快递：免运费 -- {{cart.length}}</view>
		</view>
		
		<!-- 商品详情信息 -->
		<rich-text :nodes="goods_info.goods_introduce"></rich-text>
		
		<!-- 商品导航组件 -->
		<view class="goods_nav">
			<!-- fill控制右侧按钮的样式 -->
			<!-- options 左侧按钮的配置项 -->
			<!-- buttonGroup 右侧按钮的配置项 -->
			<!-- click 左侧按钮的点击事件处理函数 -->
			<!-- buttonClick 右侧按钮的点击事件处理函数 -->
			<uni-goods-nav :fill="true" :options="options" :button-group="buttonGroup" @click="onClick" @buttonClick="buttonClick" />
		</view>
	</view>
</template>

<script>
	import {mapState, mapMutations, mapGetters} from 'vuex'
	export default {
		data() {
			return {
				// 商品详情对象
				goods_info: {},
				// 左侧按钮组的配置对象
				options: [{
					icon: 'shop',
					text: '店铺'
				}, {
					icon: 'cart',
					text: '购物车',
					info: 2
				}],
				// 右侧按钮组的配置对象
				buttonGroup: [{
					text: '加入购物车',
					backgroundColor: '#ff0000',
					color: '#ffffff'
				}, {
					text: '立即购买',
					backgroundColor: '#ffa200',
					color: '#ffffff'
				}]
			}
		},
		computed: {
			// 调用mapState方法，把m_cart模块中的cart数组映射到当前页面，作为计算属性使用
			...mapState('m_cart', ['cart']),
			...mapGetters('m_cart', ['total'])
		},
		watch: {
			// 定义total侦听器，指向一个配置对象
			total: {
				// handler 方法用来定义侦听器的处理函数
				handler(newVal) {
					// 通过数组的find()方法，找到购物车按钮的配置对象
					const findResult = this.options.find(x => x.text === '购物车')
					if(findResult) {
						// 动态为购物车按钮的info属性赋值
						findResult.info = newVal
					}
				},
				immediate: true
			}
		},
		onLoad(options) {
			// 获取商品Id
			const goods_id = options.goods_id
			// 调用请求商品详情数据的方法
			this.getGoodsDetail(goods_id)
		},
		methods: {
			// 定义请求商品详情数据的方法
			async getGoodsDetail(goods_id) {
				const {data: res} = await uni.$http.get('/api/public/v1/goods/detail', {goods_id})
				
				// 使用字符串的replace()方法，为img标签添加行内的style样式，从而解决图片底部空白间隙的问题
				// 将webp的后缀名替换成jpg的后缀名，解决 .webp 格式的图片无法在 ios 设备上正常显示的问题
				res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g, '<img style="display:block;" ').replace(/webp/g, 'jpg')
				this.goods_info = res.message
			},
			// 实现轮播图的预览效果
			preview(i) {
				uni.previewImage({
					// 预览时，默认显示图片的索引
					current: i,
					// 所有图片url地址的数组
					urls: this.goods_info.pics.map(x => x.pics_big)
				})
			},
			// 左侧按钮点击事件处理函数
			onClick(e) {
				if(e.content.text === '购物车') {
					// 切换到购物车页面
					uni.switchTab({
						url: '/pages/cart/cart'
					})
				}
			},
			// 右侧按钮点击事件处理函数
			buttonClick(e) {
				// 1. 判断是否点击了加入购物车按钮
				if(e.content.text === '加入购物车') {
					// 2. 组织一个商品的信息对象
					const goods = {
						goods_id: this.goods_info.goods_id,
						goods_name: this.goods_info.goods_name,
						goods_price: this.goods_info.goods_price,
						goods_count: 1,
						goods_small_logo: this.goods_info.goods_small_logo,
						goods_state: true
					}
					// 3. 通过this调用映射过来的addToCart方法，把商品信息对象存储到购物车中
					this.addToCart(goods)
				}
			},
			// 把m_cart模块中的addToCart方法映射到当前页面使用
			...mapMutations('m_cart', ['addToCart']),
		}
	}
</script>

<style lang="scss">
	swiper {
		height: 750rpx;
		
		image {
			width: 100%;
			height: 100%;
		}
	}
	
	// 商品信息区域的样式
	.goods-info-box {
	  padding: 10px;
	  padding-right: 0;
	
	  .price {
	    color: #c00000;
	    font-size: 18px;
	    margin: 10px 0;
	  }
	
	  .goods-info-body {
	    display: flex;
	    justify-content: space-between;
	
	    .goods-name {
	      font-size: 13px;
	      padding-right: 10px;
	    }
	    // 收藏区域
	    .favi {
	      width: 120px;
	      font-size: 12px;
	      display: flex;
	      flex-direction: column;
	      justify-content: center;
	      align-items: center;
	      border-left: 1px solid #efefef;
	      color: gray;
	    }
	  }
	
	  // 运费
	  .yf {
	    margin: 10px 0;
	    font-size: 12px;
	    color: gray;
	  }
	}
	
	.goods-detail-container {
	  // 给页面外层的容器，添加 50px 的内padding，
	  // 防止页面内容被底部的商品导航组件遮盖
	  padding-bottom: 50px;
	}
	
	.goods_nav {
	  // 为商品导航组件添加固定定位
	  position: fixed;
	  bottom: 0;
	  left: 0;
	  width: 100%;
	}
</style>