<template>
	<view class="mcontent">
		<view class="rheader">
			<view class="input-row">
				<view class="tapname" @tap="detail(1)"><view :class="selectno == 1 ? 'selected' : 'taptext'">货品明细</view></view>
				<view class="tapname" @tap="detail(2)"><view :class="selectno == 2 ? 'selected' : 'taptext'">条码明细</view></view>
			</view>
		</view>
		<view class="vlist" v-if="selectno == 1">
			<view v-for="item in fgdtlitem" style="padding: 14px 14px;border-bottom: 1px solid #E5E5E5;">
				<view style="color: #303030;font-size: 18px;font-weight: bold;">{{ item.fgoodsname }}</view>
				<view class="input-row" style="margin-top: 8px;">
					<view style="color: #888888;font-size: 14px;width: 70%;">规格：{{ item.fsizedesc }}</view>
					<view style="text-align: right;width: 30%;font-size: 16px;color: #31D06B;">
						本次：
						<text style="font-weight: bold;">{{ item.fpackqty }}</text>
					</view>
				</view>
				<view style="color: #888888;font-size: 14px;margin-top: 4px;">订单：{{ item.fstkordno }}</view>
				<view class="input-row" style="margin-top: 4px;">
					<view style="color: #888888;font-size: 14px;width: 70%;">品号：{{ item.fgoodscode }}</view>
					<view style="width: 30%;text-align: right;font-size: 16px;color: #EB433A;">未组：{{ item.funtrayqty }}</view>
				</view>
			</view>
		</view>
		<uniSwipeAction class="vlist" v-if="selectno == 2">
			<uniSwipeActionItem :options="options" v-for="item in baritem" @tap="onDelete(item.fbarcode)" style="border-bottom: 1px solid #E5E5E5;" class="input-row">
				<view style="width: 80%;padding-left: 14px;">
					<view style="color: #303030;font-size: 20px;font-weight: bold;padding-top: 14px;">{{ item.fbarcode }}</view>
					<view style="color: #888888;font-size: 16px;margin-top: 8px;padding-bottom: 14px;">{{ item.fscanor }} {{ item.fscandate }} 扫描</view>
				</view>
				<view style="text-align: right;padding-right: 14px;width: 20%;font-size: 20px;color: #31D06B;font-weight: bold;line-height: 80px;">x{{ item.fbarcodeqty }}</view>
			</uniSwipeActionItem>
		</uniSwipeAction>
		<view class="vbar">
			<view class="input-row totaldiv" v-if="selectno == 1">
				<view style="width: 40%;">合计</view>
				<view style="width: 30%;">
					本次:
					<text style="font-weight: bold;">{{ thisqty }}</text>
				</view>
				<view style="width: 30%;">
					未组:
					<text style="font-weight: bold;">{{ notgroupqty }}</text>
				</view>
			</view>
			<button class="submit-button" type="warn" @tap="submit()">完成</button>
			<view class="more" @tap="more()"><img class="moreimg" src="/static/img/navbar_mobile_light@2x.png" /></view>
			<view class="moreview" v-if="moreShow">
				<view class="input-row" style="margin-bottom: 19px;">
					<view><img style="width: 20px;height: 22px;margin-right: 11px;" src="/static/img/shanc_icon@2x.png" /></view>
					<navigator :url="'scandelete?barcode=' + barCode">删除</navigator>
				</view>
				<view class="input-row">
					<view><img style="width: 20px;height: 20px;margin-right: 11px;" src="/static/img/qux_icon@2x.png" /></view>
					<view @tap="openPopup">取消扫描</view>
				</view>
			</view>
		</view>
		<uni-popup ref="popup" type="center" class="cpopup">
			<view style="text-align: center;font-size: 16px;color: #303030;margin-top: 39px;margin-bottom: 22px;">是否签退</view>
			<view class="input-row popup-row" style="color: #E4393E;text-align: center;">
				<text style="width: 35%;" @tap="cancel">否</text>
				<text style="width: 30%;"></text>
				<text style="width: 35%;" @tap="confirm">是</text>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import uniSwipeAction from '../../components/uni-swipe-action.vue';
import uniSwipeActionItem from '../../components/uni-swipe-action-item/uni-swipe-action-item.vue';
import { request } from '@/api/http';
import uniPopup from '@/components/uni-popup.vue';
import { mapState, mapMutations } from 'vuex';

export default {
	components: {
		uniSwipeAction,
		uniSwipeActionItem,
		uniPopup
	},
	computed: {
		...mapState(['serverUrl', 'userInfo', 'fgdtlitem', 'baritem'])
	},
	data() {
		return {
			moreShow: false,
			selectno: 1,
			options: [
				{
					text: '删除',
					style: {
						backgroundColor: '#EB433A'
					}
				}
			],
			thisqty: 0,
			notgroupqty: 0,
			barCode: '',
			placecode: '',
			type: 1
		};
	},
	onLoad(option) {
		this.barCode = option.barcode;
		this.placecode = option.placecode;
		this.type = option.type;
		if (this.type == 2) {
			uni.setNavigationBarTitle({
				title: '入库单组盘'
			});
		}
		if (this.type == 0) {
			uni.setNavigationBarTitle({
				title: '生产组盘'
			});
		}
		this.fgdtlitem.forEach(item => {
			this.thisqty += item.fpackqty;
			this.notgroupqty += item.funtrayqty;
		});
	},
	onShow() {
		this.moreShow = false;
	},
	methods: {
		openPopup() {
			this.$refs.popup.open();
			this.moreShow = false;
		},
		cancel() {
			this.$refs.popup.close();
		},
		confirm() {
			var data = {
				sf_action: 'TrayPDAGrp_FGI_CancelTrayScan',
				fstktraycode: this.barCode, //托盘代号
				slanguage: this.$language,
				usercode: this.userInfo.userId,
				username: this.userInfo.userName
			};
			uni.showNavigationBarLoading();
			request(this.serverUrl + '/sfapi/TrayPDAGrp_FGI/TrayPDAGrp_FGI_CancelTrayScan', 'POST', data)
				.then(res => {
					uni.hideNavigationBarLoading();
					if (res.Succeed) {
						if (res.Data.success) {
							//缓存初始化
							var obj = {};
							obj.fgdtlitem = [];
							obj.baritem = [];
							this.initdata(obj);
							this.scanerrorlog([]);
							if (this.type == 0) {
								uni.redirectTo({
									url: '../group_disk/sctray?type=1'
								});
							}
							if (this.type == 1) {
								uni.redirectTo({
									url: '../group_disk/tray?barcode=' + this.placecode
								});
							}
							if (this.type == 2) {
								uni.redirectTo({
									url: '../group_disk/rktray?barcode=' + this.placecode
								});
							}
						} else {
							uni.showToast({
								icon: 'none',
								title: res.Data.errormsg
							});
						}
					} else {
						uni.showToast({
							icon: 'none',
							title: res.ErrorMessage
						});
					}
				})
				.catch(e => {
					uni.hideNavigationBarLoading();
					uni.showToast({
						icon: 'none',
						title: '请求异常'
					});
				});
		},
		submit() {
			var data = {
				sf_action: 'TrayPDAGrp_FGI_SaveBar',
				fstktraycode: this.barCode, //托盘代号
				fstkinlogno: this.barCode, //入库单号
				ftraygrptype: this.type, //组盘类型
				fplacecode: this.placecode, //储位代号
				slanguage: this.$language,
				usercode: this.userInfo.userId,
				username: this.userInfo.userName
			};
			uni.showNavigationBarLoading();
			request(this.serverUrl + '/sfapi/TrayPDAGrp_FGI/TrayPDAGrp_FGI_SaveBar', 'POST', data)
				.then(res => {
					uni.hideNavigationBarLoading();
					if (res.Succeed) {
						if (res.Data.success) {
							//缓存初始化
							var obj = {};
							obj.fgdtlitem = [];
							obj.baritem = [];
							this.initdata(obj);
							this.scanerrorlog([]);
							if (this.type == 0) {
								//生产组盘
								uni.redirectTo({
									url: '../group_disk/sctray?type=1'
								});
							}
							if (this.type == 1) {
								//期初组盘
								uni.redirectTo({
									url: '../group_disk/storagelocation?type=1'
								});
							}
							if (this.type == 2) {
								//入库单组盘
								uni.redirectTo({
									url: '../group_disk/warehousing?type=1'
								});
							}
						} else {
							uni.showToast({
								icon: 'none',
								title: res.Data.errormsg
							});
						}
					} else {
						uni.showToast({
							icon: 'none',
							title: res.ErrorMessage
						});
					}
				})
				.catch(e => {
					uni.hideNavigationBarLoading();
					uni.showToast({
						icon: 'none',
						title: '请求异常'
					});
				});
		},
		getDateFormat() {
			var myDate = new Date();
			var year = myDate.getFullYear();
			var month = myDate.getMonth() + 1;
			var date = myDate.getDate();

			var h = myDate.getHours();
			var m = myDate.getMinutes();
			var s = myDate.getSeconds();
			var now = year + '-' + this.getNow(month) + '-' + this.getNow(date) + ' ' + this.getNow(h) + ':' + this.getNow(m) + ':' + this.getNow(s);
			return now;
		},
		getNow(s) {
			return s < 10 ? '0' + s : s;
		},
		more() {
			this.moreShow = !this.moreShow;
		},
		detail(id) {
			this.moreShow = false;
			this.selectno = id;
		},
		onDelete(fbarcode) {
			var data = {
				sf_action: 'TrayPDAGrp_FGI_DelBar',
				fbarcode: fbarcode, //条码代号
				fstktraycode: this.barCode, //托盘代号
				slanguage: this.$language,
				usercode: this.userInfo.userId,
				username: this.userInfo.userName
			};
			uni.showNavigationBarLoading();
			request(this.serverUrl + '/sfapi/TrayPDAGrp_FGI/TrayPDAGrp_FGI_DelBar', 'POST', data)
				.then(res => {
					uni.hideNavigationBarLoading();
					if (res.Succeed) {
						if (res.Data.success) {
							var fgdtldata = this.fgdtlitem;
							var bardata = this.baritem;
							res.Data.data.fgdtlitem.forEach(item => {
								fgdtldata.forEach(res => {
									if (res.fgoodsid == item.fgoodsid && res.fstkordno == item.fstkordno) {
										res.fpackqty += item.fpackqty;
									}
								});
							});
							var ind = -1;
							bardata.forEach((item, index) => {
								if (item.fbarcode == res.Data.data.baritem[0].fbarcode) {
									ind = index;
								}
							});
							bardata.splice(ind, 1);
							var obj = {};
							obj.fgdtlitem = fgdtldata;
							obj.baritem = bardata;
							this.initdata(obj);
							uni.showModal({
								content: '删除成功',
								showCancel: false
							});
						} else {
							uni.showToast({
								icon: 'none',
								title: res.Data.errormsg
							});
						}
					} else {
						uni.showToast({
							icon: 'none',
							title: res.ErrorMessage
						});
					}
				})
				.catch(e => {
					uni.hideNavigationBarLoading();
					uni.showToast({
						icon: 'none',
						title: '请求异常'
					});
				});
		}
	}
};
</script>

<style>
.mcontent {
	display: flex;
	flex: 1;
	flex-direction: column;
}
.rheader {
	font-size: 18px;
	z-index: 9999;
	position: fixed;
	right: 0px;
	left: 0;
	background-color: #ffffff;
	border-bottom: 16px solid #f5f5f5;
}
.vlist {
	width: 100%;
	margin-bottom: 90px;
	margin-top: 62px;
}
.vbar {
	z-index: 9998;
	position: fixed;
	right: 0px;
	left: 0;
	bottom: 0;
}
.submit-button {
	height: 44px;
	line-height: 42px;
	font-size: 16px;
}
.more {
	position: absolute;
	right: 0;
	top: 0;
	width: 42px;
	height: 44px;
	border-left: 1px solid #ffffff;
	padding-left: 12px;
	padding-top: 7px;
}
.moreimg {
	width: 30px;
	height: 30px;
}
.moreview {
	position: absolute;
	right: 0;
	top: -111px;
	background-color: #ffffff;
	padding: 20px 14px;
	color: #888888;
	font-size: 16px;
	border-left: 1px solid #d5d5d5;
	border-top: 1px solid #d5d5d5;
}
.tapname {
	width: 50%;
	text-align: center;
}
.taptext {
	width: 88px;
	margin: 0 auto;
	padding: 10px 0;
	color: #b7b7b7;
}
.selected {
	width: 88px;
	margin: 0 auto;
	padding: 10px 0;
	color: #eb433a;
	font-weight: bold;
	border-bottom: 4px solid #eb433a;
}
.totaldiv {
	position: absolute;
	top: -43px;
	background-color: #f5f5f5;
	padding: 8px 14px;
	width: 100%;
	color: #303030;
	font-size: 18px;
}
.popup-row {
	height: 50px;
	line-height: 50px;
}
.cpopup {
	padding: 0 auto;
}
</style>
