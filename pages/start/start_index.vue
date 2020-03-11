<template>
	<view style="width: 100%; background-color: #ffffffff;"></view>
</template>

<script>
import testDate from '../../common/testData.js';
// import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue'
export default {
	// components:{
	// 	uniSearchBar
	// },
	onLoad() {
		if (process.env.NODE_ENV === 'development') {
			//开发环境使用本地测试数据
			var data = testDate.getTestData();
			this.saveData(data);
		} else {
			//生产环境使用正式动态数据
			var data = JSON.parse(plus.runtime.arguments);
			this.saveData(data);
		}
	},
	methods: {
		//缓存数据
		saveData(data) {
			//这是我设置的缓存信息    将url数据缓存到本地
			uni.setStorage({
				key: this.GLOBAL.Key_User,
				data: data, //data中存放的是我的用户信息
				success: function(res) {
					//成功之后的回调函数
					console.log('保存测试数据' + res.toLocaleString());
					//入库
					if (data.fProg.toLocaleLowerCase() === 'stkapp_purpickrc') {
						//入库——采购接收
						uni.navigateTo({
							url: '/pages/not_barcode/stkin/purpick/stkin_purpick_receive'
						});
					} else if (data.fProg.toLocaleLowerCase() === 'stkapp_othin') {
						//入库——其它（杂项）入库
						uni.navigateTo({
							url: '/pages/not_barcode/stkin/other/stkin_other'
						});
					}
					//出库
					else if (data.fProg.toLocaleLowerCase() === 'stkapp_prodpick') {
						//出库——生产领料
						uni.navigateTo({
							url: '/pages/not_barcode/stkout/prodpick/stkout_prodpick'
						});
					} else if (data.fProg.toLocaleLowerCase() === 'stkapp_purrtn') {
						//出库——采购退货
						uni.navigateTo({
							url: '/pages/not_barcode/stkout/purpick/stkout_purpick_refund'
						});
					} else if (data.fProg.toLocaleLowerCase() === 'stkapp_othout') {
						//出库——其它（杂项）出库
						uni.navigateTo({
							url: '/pages/not_barcode/stkout/other/stkout_other'
						});
					}
					//在库
					else if (data.fProg.toLocaleLowerCase() === 'stkapp_stktran') {
						//在库——移库
						uni.navigateTo({
							url: '/pages/not_barcode/inlibrary/stktran'
						});
					}
					//盘点
					else if (data.fProg.toLocaleLowerCase() === 'pda_inbillgrp') {
						//入库单组盘
						uni.navigateTo({
							url: '/pages/group_disk/sctray'
						});
					} else if (data.fProg.toLocaleLowerCase() === 'pda_prdlinegrp') {
						//生产线组盘
						uni.navigateTo({
							url: '/pages/group_disk/sctray'
						});
					} else if (data.fProg.toLocaleLowerCase() === 'pda_initialgrp') {
						//期初组盘
						uni.navigateTo({
							url: '/pages/group_disk/gdisklist'
						});
					} else if (data.fProg.toLocaleLowerCase() === 'stkapp_stkqry') {
						//在库查询
						uni.navigateTo({
							url: '/pages/not_barcode/inTheQuery/inQuery'
						});
					}
				}
			});
		}
	}
};
</script>

<style>
/* 	.m-input-view {
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 100%;
		flex: 1;
		padding: 0 10rpx;
	}

	.scanimg {
		width: 30px;
		height: 30px;
		margin-right: 10px;
		margin-top: 10px;
		display: block;
		border: none;
	}

	.nofi_view {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 2px 12px 0px 12px;
	}

	.title_text {
		color: $color-theme;
		font-size: $font-size-md;
	}

	.des_text {
		color: $color-subtitle;
		font-size: $font-size-md;
	} */
</style>
