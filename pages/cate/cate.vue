<template>
	<view>
		<!-- 使用自定义的搜索组件 -->
		<my-search @click="gotoSearch"></my-search>
		<view class="scroll-view-container">
			<!-- 左侧的滚动视图区域 -->
			<scroll-view scroll-y="true" class="left-scroll-view" :style="{height:wh+'px'}">
				<block v-for="(item, i) in cateList" :key="i">
					<view class="left-scroll-view-item" :class="{active: active === i}" @click="activeChanged(i)">{{item.cat_name}}</view>
				</block>
			</scroll-view>
			<!-- 右侧的滚动视图区域 -->
			<scroll-view scroll-y="true" class="right-scroll-view" :style="{height:wh+'px'}" :scroll-top="scrollTop">
				<view class="cate-lv2" v-for="(item2, i2) in cateLevel2" :key="i2">
					<!-- 二级分类 -->
					<view class="cate-lv2-title">/ {{item2.cat_name}} /</view>
					<!-- 三级分类 -->
					<view class="cate-lv3-list">
						<view class="cate-lv3-item" v-for="(item3, i3) in item2.children" :key="i3" @click="getGoodsList(item3)">
							<!-- 图片 -->
							<image mode=""></image>
							<!-- 文本 -->
							<text>{{item3.cat_name}}</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import badgeMix from '@/mixins/tabbar-badge.js'
	export default {
		mixins: [badgeMix],
		data() {
			return {
				// 窗口的可用高度 = 屏幕高度 - navigationBar高度 - tabBar高度
				wh: 0,
				// 分类数据列表
				cateList: [],
				// 当前选中的索引，默认第一项被选中
				active: 0,
				// 二级分类列表数据
				cateLevel2: [],
				// 滚动条距离顶部的距离
				scrollTop: 0
			}
		},
		onLoad() {
			// 获取当前系统的信息
			const sysInfo = uni.getSystemInfoSync()
			// 为 wh 窗口可用高度动态赋值
			this.wh = sysInfo.windowHeight - 50
			
			// 调用分类列表数据的方法
			this.getCateList()
		},
		methods: {
			// 定义获取分类列表数据的方法
			async getCateList() {
				const {data: res} = await uni.$http.get('/api/public/v1/categories')
				this.cateList = res.message
				this.cateLevel2 = res.message[0].children
			},
			// 定义改变被选中的分类的函数
			activeChanged(i) {
				this.active = i
				this.cateLevel2 = this.cateList[i].children
				// 切换时，改变scrollTop的值
				this.scrollTop = this.scrollTop ? 0 : 1
			},
			// 点击三级分类项，跳转到商品列表页面
			getGoodsList(item3) {
				uni.navigateTo({
					url: '/subpkg/goods_list/goods_list?cid=' + item3.cat_id
				})
			},
			// 跳转到分包中的搜索页面
			gotoSearch() {
				uni.navigateTo({
					url: '/subpkg/search/search'
				})
			}
		}
	}
</script>

<style lang="scss">
	.scroll-view-container {
		display: flex;
		
		.left-scroll-view {
			width: 120px;
			
			.left-scroll-view-item {
				line-height: 60px;
				background-color: #f7f7f7;
				text-align: center;
				font-size: 12px;
				
				// 激活项的样式
				&.active {
					background-color: #fff;
					position: relative;
					
					// 渲染激活项左侧的红色指示边线
					&::before {
						content: '';
						display: block;
						width: 3px;
						height: 30px;
						background-color: #c00000;
						position: absolute;
						left: 0;
						top: 50%;
						transform: translateY(-50%);
					}
				}
			}
		}
		.right-scroll-view {
			.cate-lv2-title {
				font-size: 12px;
				font-weight: bold;
				text-align: center;
				padding: 15px 0;
			}
			
			.cate-lv3-list {
				display: flex;
				flex-wrap: wrap;
				
				.cate-lv3-item {
					width: 33.33%;
					margin-bottom: 10px;
					display: flex;
					flex-direction: column;
					align-items: center;
					
					image {
						width: 60px;
						height: 60px;
					}
					
					text {
						font-size: 12px;
					}
				}
			}
		}
	}
</style>
