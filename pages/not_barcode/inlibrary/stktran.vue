<template>
	<view class="mcontent">
		<view class="top">
			<view class="input-row" style="background-color: #ffffff;">
				<!-- <m-input class="m-input" type="text" v-model="ipadd" placeholder="单号"></m-input> -->
				<view style="width: 100%; height: auto;padding-right: 30px;">
					<uniSearchBar radius="5" :defaultValue="ipadd.value" v-model="ipadd" placeholder="单号" clearButton="auto" cancelText="" @input="clearEvent"
					 @confirm="searchEvent" />
				</view>
				<view class="scanview"><img src="/static/img/scan.png" class="scanimg" @tap="scanCode()" /></view>
			</view>
			<view class="input-row" style="border: 1px solid #e5e5e5;text-align: center;">
				<view class="sfrow width40">{{ titledata.fmoveno }}</view>
				<view class="sfrow width35">{{ titledata.fplanmovedate }}</view>
				<view class="sfrow width25">{{ titledata.fcreator }}</view>
			</view>
		</view>
		<view style="margin-top: 102px; height: 100%;">
			<view class="input-row" v-for="(item, index) in dataList" :key="index" @tap="selectOrder(item.fmoveno)" :style="{borderBottom: '0.6px solid #e5e5e5',textAlign: 'center',backgroundColor:index%2==0?'#ffffff':'#f5f5f5'}">
				<view :class="item.fifcolorred ? 'sfrow bodyrow width40 colorred' : 'sfrow bodyrow width40'">{{ item.fmoveno }}</view>
				<view class="sfrow bodyrow width35">{{ formatDate(item.fplanmovedate) }}</view>
				<view class="sfrow bodyrow width25">{{ item.fcreator }}</view>
			</view>
		</view>
		<view>
			<uni-load-more :status="loadingType"></uni-load-more>
		</view>
	</view>
</template>

<script>
	import mInput from '@/components/m-input.vue';
	import uniLoadMore from '@/components/uni-load-more.vue';
	import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue';
	import {
		requestHepler
	} from '@/api/http';
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import {
		dateUtils
	} from '@/common/util.js';
	import {
		NOFI_SAVEFINSH_BILL
	} from '@/common/notificationKey.js';
	export default {
		components: {
			mInput,
			uniLoadMore,
			uniSearchBar
		},
		computed: {},
		data() {
			return {
				ipadd: {
					value: ''
				},
				pageIndex: 1,
				dataList: [
					// {
					// 	forino: '12312312',
					// 	femp: '陈实木',
					// 	fcdate: '2020-01-22'
					// }
				],
				titledata: {
					// forino: '单号',
					// femp: '制单人',
					// fcdate: '单据日期'
				},
				loadingType: 'noMore',
				code: '',
				toUrl: '/pages/not_barcode/inlibrary/detail?orderNo='
			};
		},
		onBackPress(options) {
			if (options.from === 'backbutton') {
				plus.runtime.quit()
				return false;
			}
			this.back();
			return true;
		},
		onLoad(option) {
			uni.getStorage({
				key: this.GLOBAL.Key_User,
				success: res => {
					this.code = res.data.store.fStkCode;
				}
			});
			this.LoadData(false);
			
			// 监听事件
			uni.$on(NOFI_SAVEFINSH_BILL, (orderNo) => {
				for (let i = 0; i < this.dataList.length; i++) {
					if (this.dataList[i].fmoveno === orderNo) {
						this.dataList.splice(i, 1)
						break;
					}
				}
			})
		},
		onShow() {
		},
		onPullDownRefresh: function() {
			this.pageIndex = 1;
			this.dataList = [];
			this.loadingType = 'noMore';
			this.LoadData(false);
		},
		onReachBottom: function() {
			//触底的时候请求数据，即为上拉加载更多
			//为了更加清楚的看到效果，添加了定时器
			if (this.loadingType != 'noMore') {
				this.loadingType = 'loading';
				this.LoadData(false);
			}
		},
		onUnload() {
			// 移除监听事件  
			uni.$off(NOFI_SAVEFINSH_BILL);

		},
		methods: {
			LoadData(val) {
				var data = {
					sf_action: '/GetStkMoveNoList_PDA',
					stkcode: this.code, //仓库代号
					spage: this.pageIndex,
					fmoveno: this.ipadd.value
				};
				requestHepler({
						url: '/sfapi/StkTran/GetStkMoveNoList_PDA',
						data: data
					})
					.then(res => {
						if (res) {
							this.titledata = res.title[0];
							this.pageIndex++;
							if (res.item != null && res.item.length > 0) {
								this.dataList = this.dataList.concat(res.item);
								if (this.dataList.length == 1 && val && this.ipadd != '') {
									uni.navigateTo({
										url: this.toUrl + res.item[0].fmoveno
									});
									return;
								}
								this.loadingType = 'more';
								if (res.page[0].fcurrentpage == res.page[0].fpagetotal) {
									this.loadingType = 'noMore';
								}
							} else {
								this.loadingType = 'noMore';
							}
						}
					})
					.catch(e => {});
			},
			scanCode() {
				var _this = this;
				// 允许从相机和相册扫码
				uni.scanCode({
					success: function(res) {
						_this.ipadd.value = res.result;
						_this.pageIndex = 1;
						_this.dataList = [];
						_this.loadingType = 'noMore';
						_this.LoadData(true);
					}
				});
			},
			formatDate(val) {
				return dateUtils.formatDateYMDHM(dateUtils.parse(val))
			},
			searchEvent() {
				if (this.ipadd.value == '') {
					uni.showToast({
						title: '搜索内容不能为空',
						icon: 'none'
					})
				} else {
					this.pageIndex = 1;
					this.dataList = [];
					this.loadingType = 'noMore';
					this.LoadData(true);
				}
			},
			selectOrder(fmoveno) {
				uni.navigateTo({
					url: this.toUrl + fmoveno
				});
			},
			clearEvent() {
				if (this.ipadd.value == '') {
					this.pageIndex = 1;
					this.dataList = [];
					this.loadingType = 'noMore';
					this.LoadData(false);
				}
			}
		}
	};
</script>

<style>
	.mcontent {
		display: flex;
		flex: 1;
		flex-direction: column;
		font-size: 16px;
	}

	.m-input {
		background-color: #ffffff;
		font-size: 15px;
		border-radius: 5px;
		height: 44px;
		padding-left: 20px;
		padding-right: 70px;
	}

	.hide {
		display: none;
	}

	.top {
		background-color: #f5f5f5;
		z-index: 9999;
		position: fixed;
		right: 0px;
		left: 0;
		border-top: 1px solid #f5f5f5;
	}

	.scanview {
		position: absolute;
		right: 10px;
		top: 2px;
		z-index: 1000;
	}

	.scanimg {
		width: 24px;
		height: 22px;
		margin-top: 13px;
		display: block;
		border: none;
	}

	.sfrow {
		height: 50px;
		line-height: 50px;
		font-size: 14px;
		color: #888888;
	}

	.bodyrow {
		color: #303030;
	}

	.width40 {
		width: 40%;
	}

	.width35 {
		width: 35%;
	}

	.width25 {
		width: 25%;
	}

	.colorred {
		color: red;
	}
</style>
