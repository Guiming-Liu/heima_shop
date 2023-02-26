<template>
	<view>
		<view class="goods-item">
			<!-- 商品左侧图片区域 -->
			<view class="goods-item-left">
				<!-- 存储在购物车中的商品，包含 goods_state 属性，表示商品的勾选状态 -->
				<radio :checked="goods.goods_state" color="#C00000" v-if="showRadio" @click="radioChangeHandler"/>
				<image :src="goods.goods_small_logo || defaultPic" class="goods-pic" mode=""></image>
			</view>
			<!-- 商品右侧信息区域 -->
			<view class="goods-item-right">
				<!-- 商品标题 -->
				<view class="goods-name">{{goods.goods_name}}</view>
				<view class="goods-info-box">
					<!-- 商品价格 -->
					<view class="goods-price">￥{{goods.goods_price | tofixed}}</view>
					<!-- 商品数量 -->
					<uni-number-box :min="1" :value="goods.goods_count" @change="numChangeHandler" v-if="showNum"></uni-number-box>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"my-goods",
		props: {
			// 商品的信息对象
			goods: {
				type: Object,
				default: {}
			},
			// 是否显示图片左侧的radio
			showRadio: {
				type: Boolean,
				default: false
			},
			// 是否展示价格右侧的NumberBox组件
			showNum: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				// 默认的空图片
				defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
			}
		},
		filters: {
			// 把数字处理为带两位小数点的数字
			tofixed(num) {
				return Number(num).toFixed(2)
			}
		},
		methods: {
			// radio组件的点击事件处理函数
			radioChangeHandler() {
				// 通过this.$emit()触发外界通过绑定 @ 绑定的radio-change 事件
				// 同时把商品ID和勾选状态作为参数传递给radio-change事件处理函数
				this.$emit('radio-change', {
					goods_id: this.goods.goods_id,
					goods_state: !this.goods.goods_state
				})
			},
			// NumberBox组件的change事件处理函数
			numChangeHandler(val) {
				this.$emit('num-change', {
					goods_id: this.goods.goods_id,
					goods_count: +val
				})
			}
		}
	}
</script>

<style lang="scss">
	.goods-item {
	  display: flex;
	  padding: 10px 5px;
	  border-bottom: 1px solid #f0f0f0;
	  width: 750rpx;
	  box-sizing: border-box;
	
	  .goods-item-left {
	    margin-right: 5px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	
	    .goods-pic {
	      width: 100px;
	      height: 100px;
	      display: block;
	    }
	  }
	
	  .goods-item-right {
	    display: flex;
		flex: 1;
	    flex-direction: column;
	    justify-content: space-between;
	
	    .goods-name {
	      font-size: 13px;
	    }
		
		.goods-info-box {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
	
	    .goods-price {
	      font-size: 16px;
	      color: #c00000;
	    }
	  }
	}
</style>